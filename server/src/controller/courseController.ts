// import { type Request, type Response, type NextFunction } from 'express'
import { type Request, type Response } from 'express'
import { type Result, type ValidationError } from 'express-validator'
const { body, validationResult } = require('express-validator')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')
const authHelper = require('../middleware/authHelper')
const roleHelper = require('../middleware/roleHelper')

export const courseCreatePost = [
  body('title').not().isEmpty().withMessage('title must be specified.'),
  body('price')
    .trim()
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('price must be a decimal'),
  body('what_you_will_learn.*.order')
    .trim()
    .isInt()
    .withMessage('order must be an integer number'),
  body('requirements').custom((value: any) => {
    if (value == null) throw new Error('requirements must be specified.')
    const keys = Object.keys(value)
    const nonIntegerKeys = keys.filter((key) => !/^[0-9]+$/.test(key))
    if (nonIntegerKeys.length > 0) throw new Error('keys must be integers.')

    const values: string[] = Object.values(value)
    const emptyValues = values.filter((value) => value.length === 0)
    if (emptyValues.length > 0) throw new Error('values must be specified.')
    return true
  }),
  body('what_you_will_learn').custom((value: any) => {
    if (value == null) throw new Error('what_you_will_learn must be specified.')
    const keys = Object.keys(value)
    const nonIntegerKeys = keys.filter((key) => !/^[0-9]+$/.test(key))
    if (nonIntegerKeys.length > 0) throw new Error('keys must be integers.')

    const values: string[] = Object.values(value)
    const emptyValues = values.filter((value) => value.length === 0)
    if (emptyValues.length > 0) throw new Error('values must be specified.')
    return true
  }),
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
  body('content').custom((value: any) => {
    if (value == null) throw new Error('content must be specified.')
    const keys = Object.keys(value)
    const nonIntegerKeys = keys.filter((key) => !/^[0-9]+$/.test(key))
    if (nonIntegerKeys.length > 0) throw new Error('keys must be integers.')
    return true
  }),
  body('content.*.id').not().isEmpty().withMessage('id must be specified.'),
  body('content.*.title')
    .not()
    .isEmpty()
    .withMessage('title must be specified.'),
  body('content.*.type')
    .isIn(['video', 'reading', 'quiz'])
    .withMessage('invalid value.'),
  body('content.*.public').isBoolean().withMessage('public must be boolean.'),
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
      const oldContent = queryResp2.rows[0].content
      const oldIds = Object.values(oldContent).map((value: any) => value.id)

      const newContent = _req.body.content
      const newIds = Object.values(newContent).map((value: any) => value.id)

      const toDelete = oldIds.filter((id: string) => !newIds.includes(id))
      console.log(toDelete)

      // TODO: delete toDelete files from s3

      // update course content
      await dbConnection.dbQuery(queries.queryList.UPDATE_COURSE_CONTENT, [
        _req.body.content,
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
  roleHelper.checkCourseFullAccess,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp1 = await dbConnection.dbQuery(
        queries.queryList.GET_COURSE,
        [_req.params.courseId]
      )
      const course = queryResp1.rows[0]

      const queryResp2 = await dbConnection.dbQuery(
        queries.queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID,
        [course.author_id]
      )
      const author = queryResp2.rows[0]

      course.author = author
      if (_res.locals.hasFullAccess === true) {
        return _res.status(200).json(course)
      }

      const publicCourseContent: Record<string, any> = {}
      Object.keys(course.content).forEach((key: string) => {
        if (course.content[key].public === 'true') {
          publicCourseContent[key] = course.content[key]
        }
      })
      course.content = publicCourseContent

      return _res.status(200).json(course)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
