import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { getRole } from '../middleware/roleMW'
import { authenticateToken } from '../middleware/authMW'
import {
  getCourseContent,
  updateContent,
  checkAuthor
} from '../middleware/courseMW'
import { imageUploader } from '../util/awsInterface'
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

export const courseCreatePost = [
  body('title').not().isEmpty().withMessage('title must be specified.'),
  body('price')
    .trim()
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('price must be a decimal'),
  body('discount')
    .trim()
    .isInt({ min: 0, max: 100 })
    .withMessage('discount must be in range 0, 100'),
  body('discount_last_date')
    .isISO8601()
    .toDate()
    .withMessage('invalid timestamp'),
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
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    if (_res.locals.role === 'student') return _res.sendStatus(403)

    try {
      await dbQuery(queryList.ADD_COURSE, [
        _res.locals.accountId,
        _req.body.title,
        _req.body.level,
        _req.body.field,
        _req.body.department,
        _req.body.price,
        _req.body.discount,
        _req.body.discount_last_date,
        _req.body.description,
        _req.body.what_you_will_learn,
        _req.body.requirements
      ])

      const queryResp = await dbQuery(queryList.GET_LAST_ADDED_COURSE_ID, [])

      return _res.status(201).json({ id: queryResp.rows[0].currval })
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
  body('discount')
    .trim()
    .isInt({ min: 0, max: 100 })
    .withMessage('discount must be in range 0, 100'),
  body('discount_last_date')
    .isISO8601()
    .toDate()
    .withMessage('invalid timestamp'),
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
  authenticateToken,
  checkAuthor,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      await dbQuery(queryList.UPDATE_COURSE, [
        _req.body.title,
        _req.body.level,
        _req.body.field,
        _req.body.department,
        _req.body.price,
        _req.body.discount,
        _req.body.discount_last_date,
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
  body('weeks.*.id').not().isEmpty().withMessage('id must be specified.'),
  body('weeks.*.title')
    .not()
    .isEmpty()
    .withMessage('week title must be specified.'),
  body('weeks.*.content')
    .isArray({ min: 1 })
    .withMessage('lesson content must be specified.'),
  body('weeks.*.content.*.id')
    .not()
    .isEmpty()
    .withMessage('id must be specified.'),
  body('weeks.*.content.*.title')
    .not()
    .isEmpty()
    .withMessage('title must be specified.'),
  body('weeks.*.content.*.type')
    .isIn(['video', 'reading', 'quiz'])
    .withMessage('invalid value.'),
  body('weeks.*.content.*.is_public')
    .isBoolean()
    .withMessage('is_public must be boolean.'),
  authenticateToken,
  checkAuthor,
  getCourseContent,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }
    interface Lesson {
      id: string
      type: string
      title: string
      is_public: boolean
    }
    interface Week {
      id: string
      title: string
      content: Lesson[]
    }
    interface CourseContent {
      weeks: Week[]
    }

    try {
      const courseId = _req.params.courseId
      const courseContent: CourseContent = _req.body
      const OldCourseContent: Week[] = _res.locals.courseContent

      if (OldCourseContent.length === 0) {
        // first time to add content
        await dbQuery('begin', [])
        let weekOrder = 0
        for (const week of courseContent.weeks) {
          await dbQuery(queryList.ADD_WEEK, [
            week.id,
            courseId,
            week.title,
            String(weekOrder++)
          ])
          let lessonOrder = 0
          for (const lesson of week.content) {
            await dbQuery(queryList.ADD_LESSON, [
              lesson.id,
              week.id,
              courseId,
              lesson.title,
              String(lessonOrder++),
              lesson.type,
              String(lesson.is_public)
            ])
            if (lesson.type === 'video') {
              await dbQuery(queryList.ADD_VIDEO_HIDDEN_ID, [
                lesson.id,
                uuidv4()
              ])
            }
          }
        }
        await dbQuery('commit', [])
        return _res.sendStatus(200)
      }

      await dbQuery('begin', [])
      await updateContent(OldCourseContent, courseContent.weeks, courseId)
      await dbQuery('commit', [])

      return _res.sendStatus(200)
    } catch {
      await dbQuery('rollback', [])
      return _res.sendStatus(500)
    }
  }
]

export const courseDetailsGet = [
  getCourseContent,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const queryResp1 = await dbQuery(queryList.GET_COURSE, [
        _req.params.courseId
      ])
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)
      const course = queryResp1.rows[0]

      if (course.publish === false) {
        _next()
        return
      }

      const queryResp2 = await dbQuery(queryList.GET_COURSE_RATE, [
        _req.params.courseId
      ])
      if (queryResp2.rows.length === 0) return _res.sendStatus(404)
      course.rate = queryResp2.rows[0].avg

      const queryResp3 = await dbQuery(queryList.GET_COURSE_PURCHASES_COUNT, [
        _req.params.courseId
      ])
      if (queryResp3.rows.length === 0) return _res.sendStatus(404)
      course.purchase_count = queryResp3.rows[0].count

      course.content = _res.locals.courseContent

      // get author data
      const queryResp4 = await Promise.all([
        dbQuery(queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ]),
        dbQuery(queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ])
      ])
      if (queryResp4[0].rows.length === 0) return _res.sendStatus(404)

      const accData = queryResp4[0].rows[0]
      accData.bio = ''
      accData.image = null
      accData.contacts = {}

      if (queryResp4[1].rows.length !== 0) {
        accData.bio = queryResp4[1].rows[0].bio
        accData.contacts = queryResp4[1].rows[0].contacts
        accData.image = queryResp4[1].rows[0].pic_id
      }

      course.author = accData

      return _res.status(200).json(course)
    } catch {
      return _res.sendStatus(500)
    }
  },
  authenticateToken,
  checkAuthor,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp1 = await dbQuery(queryList.GET_COURSE, [
        _req.params.courseId
      ])
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)
      const course = queryResp1.rows[0]

      const queryResp2 = await dbQuery(queryList.GET_COURSE_RATE, [
        _req.params.courseId
      ])
      if (queryResp2.rows.length === 0) return _res.sendStatus(404)
      course.rate = queryResp2.rows[0].avg

      const queryResp3 = await dbQuery(queryList.GET_COURSE_PURCHASES_COUNT, [
        _req.params.courseId
      ])
      if (queryResp3.rows.length === 0) return _res.sendStatus(404)
      course.purchase_count = queryResp3.rows[0].count

      course.content = _res.locals.courseContent

      // get author data
      const queryResp4 = await Promise.all([
        dbQuery(queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ]),
        dbQuery(queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ])
      ])
      if (queryResp4[0].rows.length === 0) return _res.sendStatus(404)

      const accData = queryResp4[0].rows[0]
      accData.bio = ''
      accData.image = null
      accData.contacts = {}

      if (queryResp4[1].rows.length !== 0) {
        accData.bio = queryResp4[1].rows[0].bio
        accData.contacts = queryResp4[1].rows[0].contacts
        accData.image = queryResp4[1].rows[0].pic_id
      }

      course.author = accData

      return _res.status(200).json(course)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const coursePublishPatch = [
  authenticateToken,
  checkAuthor,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp = await dbQuery(queryList.COUNT_COURSE_LESSONS, [
        _req.params.courseId
      ])
      if (Number(queryResp.rows[0].count) === 0) {
        return _res
          .status(400)
          .json({ msg: 'can not publish course with empty content' })
      }

      await dbQuery(queryList.PUBLISH_COURSE, [_req.params.courseId])

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const courseImagePost = [
  authenticateToken,
  checkAuthor,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const courseId = _req.params.courseId
      const imageId = _req.params.imageId

      const queryResp = await dbQuery(queryList.GET_COURSE, [courseId])
      if (queryResp.rows.length === 0) return _res.sendStatus(404)

      if (queryResp.rows[0].pic_id === null) {
        await dbQuery(queryList.ADD_COURSE_IMAGE, [courseId, imageId])
      } else if (queryResp.rows[0].pic_id !== imageId) {
        return _res.sendStatus(400)
      }

      _next()
    } catch {
      return _res.sendStatus(500)
    }
  },
  imageUploader.single('image'),
  (_req: Request, _res: Response) => _res.sendStatus(200)
]

export const coursePurchasePost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  body('paid').isInt({ min: 0 }).withMessage('paid must be an integer'),
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      if (_res.locals.role === 'admin') {
        const queryResp = await Promise.all([
          dbQuery(queryList.GET_ACCOUNT_DETAILS_BY_MAIL, [_req.body.mail]),
          dbQuery(queryList.GET_COURSE, [_req.params.courseId])
        ])

        if (queryResp[0].rows.length === 0 || queryResp[1].rows.length === 0) {
          return _res.sendStatus(404)
        }
        if (
          queryResp[0].rows[0].role !== 'student' ||
          queryResp[1].rows[0].publish === false
        ) {
          return _res.sendStatus(400)
        }

        const queryResp2 = await dbQuery(queryList.CHECK_PURCHASE, [
          queryResp[0].rows[0].id,
          _req.params.courseId
        ])

        if (queryResp2.rows[0].exists === false) {
          await dbQuery(queryList.ADD_PURCHASE, [
            queryResp[0].rows[0].id,
            _req.params.courseId,
            _req.body.paid
          ])
        }

        return _res.sendStatus(200)
      }

      if (_res.locals.role === 'student') {
        const queryResp = await Promise.all([
          dbQuery(queryList.GET_ACCOUNT_DETAILS_BY_MAIL, [_req.body.mail]),
          dbQuery(queryList.GET_COURSE, [_req.params.courseId])
        ])

        if (queryResp[0].rows.length === 0 || queryResp[1].rows.length === 0) {
          return _res.sendStatus(404)
        }
        const coursePrice: number = queryResp[1].rows[0].price
        const courseDiscount: number = queryResp[1].rows[0].discount
        const discountDeadline: Date = queryResp[1].rows[0].discount_last_date

        let price = coursePrice
        if (
          new Date().getTime() < discountDeadline.getTime() &&
          Number(courseDiscount) === 100
        ) {
          price = 0
        }

        if (
          Number(queryResp[0].rows[0].id) !== Number(_res.locals.accountId) ||
          queryResp[1].rows[0].publish === false ||
          _req.body.paid !== 0 ||
          Number(price) !== 0
        ) {
          return _res.sendStatus(400)
        }

        const queryResp2 = await dbQuery(queryList.CHECK_PURCHASE, [
          queryResp[0].rows[0].id,
          _req.params.courseId
        ])

        if (queryResp2.rows[0].exists === false) {
          await dbQuery(queryList.ADD_PURCHASE, [
            queryResp[0].rows[0].id,
            _req.params.courseId,
            _req.body.paid
          ])
        }

        return _res.sendStatus(200)
      }

      return _res.sendStatus(400)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const progressGet = [
  authenticateToken,
  getCourseContent,
  async (_req: Request, _res: Response) => {
    interface Lesson {
      id: string
      type: string
      title: string
      is_public: boolean
      completed: boolean
    }
    interface Week {
      id: string
      title: string
      content: Lesson[]
    }

    try {
      const accountId: string = _res.locals.accountId
      const courseId = _req.params.courseId
      const courseContent: Week[] = _res.locals.courseContent

      const queryResp1 = await dbQuery(queryList.CHECK_PURCHASE, [
        accountId,
        courseId
      ])
      if (queryResp1.rows[0].exists === false) {
        return _res.status(200).json({ content: courseContent })
      }

      const queryResp2 = await dbQuery(queryList.GET_COMPLETED, [
        accountId,
        courseId
      ])

      for (const week of courseContent) {
        for (const lesson of week.content) {
          const completed = queryResp2.rows.findIndex(
            (row: any) => row.lesson_id === lesson.id
          )

          lesson.completed = completed !== -1
        }
      }

      return _res.status(200).json({ content: courseContent })
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const exploreGet = [
  async (_req: Request, _res: Response) => {
    try {
      const queryResp = await dbQuery(queryList.EXPLORE_COURSES, [])

      return _res.status(200).json(queryResp.rows)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
