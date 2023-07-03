import { type Request, type Response } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
const { body, validationResult } = require('express-validator')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')
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
  body('what_you_will_learn.body.*.order')
    .trim()
    .isInt()
    .withMessage('order must be an integer'),
  body('what_you_will_learn.body.*.content')
    .trim()
    .not()
    .isEmpty()
    .withMessage('content must be specified'),
  body('requirements.body.*.order')
    .trim()
    .isInt()
    .withMessage('order must be an integer'),
  body('requirements.body.*.content')
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
  body('fields.*.id').not().isEmpty().withMessage('id must be specified.'),
  body('fields.*.title')
    .not()
    .isEmpty()
    .withMessage('title must be specified.'),
  body('fields.*.type')
    .isIn(['video', 'reading', 'quiz'])
    .withMessage('invalid value.'),
  body('fields.*.public').isBoolean().withMessage('public must be boolean.'),
  body('fields.*.order').trim().isInt().withMessage('order must be integer.'),
  authHelper.authenticateToken,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      const courseId: string = _req.params.courseId
      if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

      // check if he's the author
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.CHECK_COURSE_AUTHOR,
        [courseId, _res.locals.accountId]
      )
      if (queryResp.rows[0].exists === false) return _res.sendStatus(403)

      // get the files must be deleted
      const queryResp2 = await dbConnection.dbQuery(
        queries.queryList.GET_COURSE_CONTENT,
        [courseId]
      )
      if (queryResp2.rows[0].content !== null) {
        const oldFields: object[] = queryResp2.rows[0].content.fields
        const oldIds: string[] = oldFields.map((value: any) => value.id)

        const newFields = _req.body.fields
        const newIds: string[] = newFields.map((value: any) => value.id)

        const toDelete: string[] = oldIds.filter(
          (id: string) => !newIds.includes(id)
        )
        console.log('delete from s3 ', toDelete)

        // TODO: delete toDelete files from s3
      }

      // update course content
      await dbConnection.dbQuery(queries.queryList.UPDATE_COURSE_CONTENT, [
        _req.body,
        courseId
      ])

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

export const videoStreamGet = [
  async function (_req: Request, _res: Response) {
    try {
      const videoId = _req.params.videoId
      const stream = await readStreamHelper.createAWSStream(videoId)
      // Pipe it into the _response
      stream.pipe(_res)
    } catch (err: any) {
      console.log(err)
      return _res.sendStatus(500)
    }
  }
]

export const videoUploadPost = [
  function (_req: Request, _res: Response) {
    return _res.sendStatus(200)
  }
]

export const videoDelete = [
  async (_req: Request, _res: Response) => {
    try {
      const videoId = _req.params.videoId
      const resp = await s3.client.send(
        new DeleteObjectCommand({ Bucket: s3.BUCKET, Key: videoId })
      )
      // will delete normal if not exist
      return _res.status(204).send(resp)
    } catch (err: any) {
      console.log(err)
      return _res.sendStatus(500)
    }
  }
]
