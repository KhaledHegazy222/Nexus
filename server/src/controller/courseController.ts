import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
const format = require('pg-format')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')
const uploadHelper = require('../middleware/uploadHelper')
const authHelper = require('../middleware/authHelper')
const roleHelper = require('../middleware/roleHelper')
const readStreamHelper = require('../middleware/readStreamHelper')
const s3 = require('../s3Client')

export const courseCreatePost = [
  body('title').not().isEmpty().withMessage('title must be specified.'),
  body('price')
    .trim()
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('price must be a decimal'),
  body('what_you_will_learn.body.*')
    .trim()
    .not()
    .isEmpty()
    .withMessage('content must be specified'),
  body('requirements.body.*')
    .trim()
    .not()
    .isEmpty()
    .withMessage('content must be specified'),
  authHelper.authenticateToken,
  roleHelper.getRole,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    if (_res.locals.role === 'student') return _res.sendStatus(403)

    try {
      await dbConnection.dbQuery(queries.queryList.ADD_COURSE, [
        _res.locals.accountId,
        _req.body.title,
        _req.body.level,
        _req.body.field,
        _req.body.department,
        _req.body.price,
        _req.body.description,
        _req.body.what_you_will_learn,
        _req.body.requirements
      ])
      return _res.sendStatus(201)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const courseEditContentPatch = [
  body('fields.*.week_title')
    .not()
    .isEmpty()
    .withMessage('week title must be specified.'),
  body('fields.*.week_content.*.id')
    .not()
    .isEmpty()
    .withMessage('id must be specified.'),
  body('fields.*.week_content.*.title')
    .not()
    .isEmpty()
    .withMessage('title must be specified.'),
  body('fields.*.week_content.*.type')
    .isIn(['video', 'reading', 'quiz'])
    .withMessage('invalid value.'),
  body('fields.*.week_content.*.public')
    .isBoolean()
    .withMessage('public must be boolean.'),
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      const courseId: string = _req.params.courseId
      const newLessons: any = []
      _req.body.fields.forEach((field: any) => {
        field.week_content.forEach((lesson: any) => {
          newLessons.push({ id: lesson.id, type: lesson.type })
        })
      })

      // get the files must be deleted and changed
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_COURSE_CONTENT,
        [courseId]
      )
      if (queryResp.rows[0].content !== null) {
        const oldLessons: any = []
        queryResp.rows[0].content.fields.forEach((field: any) => {
          field.week_content.forEach((lesson: any) => {
            oldLessons.push({ id: lesson.id, type: lesson.type })
          })
        })

        const oldIds: string[] = oldLessons.map((lesson: any) => lesson.id)
        const newIds: string[] = newLessons.map((value: any) => value.id)

        const toDelete: string[] = oldIds.filter(
          (id: string) => !newIds.includes(id)
        )
        const toUpdate = newLessons.filter((newLesson: any) => {
          if (!oldIds.includes(newLesson.id)) return false
          const oldLesson: any = oldLessons.filter(
            (oldLesson: any) => oldLesson.id === newLesson.id
          )[0]
          if (oldLesson.type !== newLesson.type) return true
          return false
        })
        const toInsert = newLessons.filter(
          (lesson: any) => !oldIds.includes(lesson.id)
        )

        console.log('delete from s3 ', toDelete)
        console.log('update from s3 ', toUpdate)
        console.log('insert from s3 ', toInsert)

        // // delete toDelete, update files from s3
        await Promise.all(
          toDelete.map(async (publicId: string) => {
            const queryResp = await dbConnection.dbQuery(
              queries.queryList.GET_S3ID,
              [publicId]
            )
            if (queryResp.rows.length === 1) {
              await s3.client.send(
                new DeleteObjectCommand({
                  Bucket: s3.BUCKET,
                  Key: queryResp.rows[0].hidden_id
                })
              )
            }
          })
        )
        await Promise.all(
          toUpdate.map(async (lesson: any) => {
            const queryResp = await dbConnection.dbQuery(
              queries.queryList.GET_S3ID,
              [lesson.id]
            )
            if (queryResp.rows.length === 1) {
              await s3.client.send(
                new DeleteObjectCommand({
                  Bucket: s3.BUCKET,
                  Key: queryResp.rows[0].hidden_id
                })
              )
            }
          })
        )

        // // update db
        const transaction: any = [
          ...toDelete.map((id: string) => {
            return {
              query: queries.queryList.DELETE_LESSON,
              params: [id]
            }
          }),
          ...toUpdate.map((lesson: any) => {
            return {
              query: queries.queryList.UPDATE_LESSON,
              params: [lesson.type, lesson.id]
            }
          }),
          {
            query: queries.queryList.UPDATE_COURSE_CONTENT,
            params: [_req.body, courseId]
          }
        ]
        if (toInsert.length !== 0) {
          transaction.push({
            query: format(
              queries.queryList.ADD_LESSONS,
              toInsert.map((lesson: any) => [lesson.id, uuidv4(), lesson.type])
            )
          })
        }

        await dbConnection.dbQueries(transaction)
      } else {
        // first time to set content
        if (newLessons.length !== 0) {
          await dbConnection.dbQueries([
            {
              query: format(
                queries.queryList.ADD_LESSONS,
                newLessons.map((lesson: any) => [
                  lesson.id,
                  uuidv4(),
                  lesson.type
                ])
              )
            },
            {
              query: queries.queryList.UPDATE_COURSE_CONTENT,
              params: [_req.body, courseId]
            }
          ])
        }
      }

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const courseDetailsGet = [
  authHelper.authenticateToken,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp1 = await dbConnection.dbQuery(
        queries.queryList.GET_COURSE,
        [_req.params.courseId]
      )
      if (queryResp1.rows.length === 0) return _res.sendStatus(400)
      const course = queryResp1.rows[0]

      const queryResp2 = await dbConnection.dbQuery(
        queries.queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID,
        [course.author_id]
      )
      const author = queryResp2.rows[0]

      course.author = author

      return _res.status(200).json(course)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const coursePublishPost = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  async (_req: Request, _res: Response) => {
    try {
      await dbConnection.dbQuery(queries.queryList.PUBLISH_COURSE, [
        _req.params.courseId
      ])

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const streamTokenGet = [
  authHelper.authenticateToken,
  roleHelper.checkCourseFullAccess,
  async function (_req: Request, _res: Response) {
    try {
      const token = uuidv4()
      await dbConnection.dbQuery(queries.queryList.ADD_LESSON_TOKEN, [token])

      return _res.status(200).json({ token })
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const videoStreamGet = [
  async function (_req: Request, _res: Response) {
    try {
      const publicId = _req.params.publicId
      const token = _req.params.token

      const queryResp = await dbConnection.dbQuery(
        queries.queryList.CHECK_LESSON_TOKEN,
        [token]
      )
      if (queryResp.rows[0].exists === true) {
        const queryResp = await Promise.all([
          dbConnection.dbQuery(queries.queryList.GET_S3ID, [publicId]),
          dbConnection.dbQuery(queries.queryList.DELETE_LESSON_TOKEN, [token])
        ])
        if (queryResp[0].rows.length === 0) return _res.sendStatus(400)
        const stream = await readStreamHelper.createAWSStream(
          queryResp[0].rows[0].hidden_id
        )
        // Pipe it into the _response
        stream.pipe(_res)
      } else {
        return _res.sendStatus(403)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'UnknownError') return _res.sendStatus(404)
      }
      return _res.sendStatus(500)
    }
  }
]

export const videoUploadPost = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  async function (_req: Request, _res: Response, _next: NextFunction) {
    try {
      const publicId: string = _req.params.publicId
      const queryResp = await dbConnection.dbQuery(queries.queryList.GET_S3ID, [
        publicId
      ])
      if (
        queryResp.rows.length === 0 ||
        queryResp.rows[0].lesson_type !== 'video'
      ) {
        return _res.sendStatus(400)
      }
      _next()
    } catch {
      return _res.sendStatus(500)
    }
  },
  uploadHelper.upload.single('file'),
  function (_req: Request, _res: Response) {
    return _res.sendStatus(200)
  }
]

export const videoDelete = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  async (_req: Request, _res: Response) => {
    try {
      const publicId = _req.params.publicId
      const queryResp = await dbConnection.dbQuery(queries.queryList.GET_S3ID, [
        publicId
      ])
      if (
        queryResp.rows.length === 0 ||
        queryResp.rows[0].lesson_type !== 'video'
      ) {
        return _res.sendStatus(400)
      }

      await s3.client.send(
        new DeleteObjectCommand({
          Bucket: s3.BUCKET,
          Key: queryResp.rows[0].hidden_id
        })
      )
      // will delete normal if not exist
      return _res.sendStatus(204)
    } catch (err: any) {
      console.log(err)
      return _res.sendStatus(500)
    }
  }
]
