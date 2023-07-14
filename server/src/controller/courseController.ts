import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
const format = require('pg-format')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')
const uploadHelper = require('../middleware/uploadHelper')
const authHelper = require('../middleware/authHelper')
const roleHelper = require('../middleware/roleHelper')
const readStreamHelper = require('../middleware/readStreamHelper')
const getFromAWSHelper = require('../middleware/getFromAWSHelper')
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

export const courseEditPut = [
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
  roleHelper.checkAuthor,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      await dbConnection.dbQuery(queries.queryList.UPDATE_COURSE, [
        _req.body.title,
        _req.body.level,
        _req.body.field,
        _req.body.department,
        _req.body.price,
        _req.body.description,
        _req.body.what_you_will_learn,
        _req.body.requirements,
        _req.params.courseId
      ])
      return _res.sendStatus(200)
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

        const toDelete = oldLessons.filter((oldLesson: any) => {
          return !newIds.includes(oldLesson.id)
        })

        const toUpdate: any[] = []
        newLessons.forEach((newLesson: any) => {
          if (oldIds.includes(newLesson.id)) {
            const oldLesson: any = oldLessons.filter(
              (oldLesson: any) => oldLesson.id === newLesson.id
            )[0]
            if (oldLesson.type !== newLesson.type) {
              const lesson = newLesson
              lesson.oldType = oldLesson.type
              toUpdate.push(lesson)
            }
          }
        })
        const toInsert = newLessons.filter(
          (lesson: any) => !oldIds.includes(lesson.id)
        )

        console.log('delete from s3 ', toDelete)
        console.log('update from s3 ', toUpdate)
        console.log('insert from s3 ', toInsert)

        // // delete toDelete, update files from s3
        await Promise.all(
          toDelete.map(async (lesson: any) => {
            if (lesson.type === 'video' || lesson.type === 'reading') {
              let idToDelete = lesson.id
              if (lesson.type === 'video') {
                const queryResp = await dbConnection.dbQuery(
                  queries.queryList.GET_VIDEO_ID,
                  [lesson.id]
                )
                if (queryResp.rows.length === 1) {
                  idToDelete = queryResp.rows[0].hidden_id
                }
              }
              await s3.client.send(
                new DeleteObjectCommand({
                  Bucket: s3.BUCKET,
                  Key: idToDelete
                })
              )
            }
          })
        )
        await Promise.all(
          toUpdate.map(async (lesson: any) => {
            if (lesson.oldType === 'video' || lesson.oldType === 'reading') {
              let idToDelete = lesson.id
              if (lesson.oldType === 'video') {
                const queryResp = await dbConnection.dbQuery(
                  queries.queryList.GET_VIDEO_ID,
                  [lesson.id]
                )
                if (queryResp.rows.length === 1) {
                  idToDelete = queryResp.rows[0].hidden_id
                }
              }
              await s3.client.send(
                new DeleteObjectCommand({
                  Bucket: s3.BUCKET,
                  Key: idToDelete
                })
              )
            }
          })
        )

        // // update db
        const transaction: any = [
          ...toDelete
            .filter((lesson: any) => lesson.type === 'video')
            .map((lesson: any) => {
              return {
                query: queries.queryList.DELETE_VIDEOS_HIDDEN_ID,
                params: [lesson.id]
              }
            }),
          ...toUpdate
            .filter((lesson: any) => lesson.oldType === 'video')
            .map((lesson: any) => {
              return {
                query: queries.queryList.DELETE_VIDEOS_HIDDEN_ID,
                params: [lesson.id]
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
              queries.queryList.ADD_VIDEOS_HIDDEN_ID,
              toInsert
                .filter((lesson: any) => lesson.type === 'video')
                .map((lesson: any) => [lesson.id, uuidv4()])
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
                queries.queryList.ADD_VIDEOS_HIDDEN_ID,
                newLessons
                  .filter((lesson: any) => lesson.type === 'video')
                  .map((lesson: any) => [lesson.id, uuidv4()])
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
  roleHelper.checkLessonAccess,
  roleHelper.getLessonType,
  async function (_req: Request, _res: Response) {
    if (_res.locals.lessonType !== 'video') return _res.sendStatus(400)

    try {
      const publicId = _req.params.publicId
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_VIDEO_ID,
        [publicId]
      )
      if (queryResp.rows.length === 0) return _res.sendStatus(403)

      await s3.client.send(
        new HeadObjectCommand({
          Bucket: s3.BUCKET,
          Key: queryResp.rows[0].hidden_id
        })
      )

      const token = uuidv4()
      await dbConnection.dbQuery(queries.queryList.ADD_LESSON_TOKEN, [token])

      return _res.status(200).json({ token })
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'UnknownError') return _res.sendStatus(404)
      }
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
          dbConnection.dbQuery(queries.queryList.GET_VIDEO_ID, [publicId]),
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
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const videoUploadPost = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  roleHelper.getLessonType,
  async function (_req: Request, _res: Response, _next: NextFunction) {
    if (_res.locals.lessonType !== 'video') return _res.sendStatus(400)

    try {
      const publicId: string = _req.params.publicId
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_VIDEO_ID,
        [publicId]
      )
      if (queryResp.rows.length === 0) return _res.sendStatus(400)

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

export const readingUploadPost = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  roleHelper.getLessonType,
  async (_req: Request, _res: Response) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)

    const publicId = _req.params.publicId

    try {
      const command = new PutObjectCommand({
        Bucket: s3.BUCKET,
        Key: publicId,
        Body: _req.body.content
      })
      const response = await s3.client.send(command)
      console.log(response)

      return _res.sendStatus(201)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const readingGet = [
  authHelper.authenticateToken,
  roleHelper.checkLessonAccess,
  roleHelper.getLessonType,
  (_req: Request, _res: Response, _next: NextFunction) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)
    _next()
  },
  getFromAWSHelper.getObject,
  (_req: Request, _res: Response) => {
    return _res.status(200).json({ content: _res.locals.reading })
  }
]

export const lessonDelete = [
  authHelper.authenticateToken,
  roleHelper.checkAuthor,
  roleHelper.getLessonType,
  async (_req: Request, _res: Response) => {
    try {
      const publicId = _req.params.publicId
      let idToDelete = ''

      if (_res.locals.lessonType === 'video') {
        const queryResp = await dbConnection.dbQuery(
          queries.queryList.GET_VIDEO_ID,
          [publicId]
        )
        if (queryResp.rows.length === 0) {
          return _res.sendStatus(400)
        }
        idToDelete = queryResp.rows[0].hidden_id
      } else {
        idToDelete = publicId
      }

      await s3.client.send(
        new DeleteObjectCommand({
          Bucket: s3.BUCKET,
          Key: idToDelete
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
