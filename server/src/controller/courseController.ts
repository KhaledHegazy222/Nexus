import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { getRole } from '../middleware/roleMW'
import { authenticateToken } from '../middleware/authMW'
import {
  getCourseContent,
  updateContent,
  checkAuthor,
  checkLessonAccess,
  getLessonType,
  checkPurchase
} from '../middleware/courseMW'
import {
  uploader,
  getReading,
  uploadReading,
  createAWSStream,
  checkVideoExist
} from '../util/awsInterface'
const format = require('pg-format')
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
  async (_req: Request, _res: Response) => {
    try {
      const queryResp1 = await dbQuery(queryList.GET_COURSE, [
        _req.params.courseId
      ])
      if (queryResp1.rows.length === 0) return _res.sendStatus(400)
      const course = queryResp1.rows[0]
      course.content = _res.locals.courseContent

      // get author data
      const queryResp2 = await Promise.all([
        dbQuery(queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ]),
        dbQuery(queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID, [
          course.author_id
        ])
      ])
      if (queryResp2[0].rows.length === 0) return _res.sendStatus(404)

      const accData = queryResp2[0].rows[0]
      accData.bio = ''
      accData.contacts = {}

      if (queryResp2[1].rows.length !== 0) {
        accData.bio = queryResp2[1].rows[0].bio
        accData.contacts = queryResp2[1].rows[0].contacts
      }

      course.author = accData

      return _res.status(200).json(course)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const courseMineGet = [
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp = await dbQuery(
        _res.locals.role === 'student'
          ? queryList.GET_STUDENT_COURSES
          : queryList.GET_INSTRUCTOR_COURSES,
        [_res.locals.accountId]
      )

      return _res.status(200).json(queryResp.rows)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const coursePublishPost = [
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

export const streamTokenGet = [
  authenticateToken,
  checkLessonAccess,
  getLessonType,
  async function (_req: Request, _res: Response) {
    if (_res.locals.lessonType !== 'video') return _res.sendStatus(400)

    try {
      const publicId = _req.params.publicId
      const queryResp = await dbQuery(queryList.GET_VIDEO_ID, [publicId])
      if (queryResp.rows.length === 0) return _res.sendStatus(403)

      const isExist = await checkVideoExist(queryResp.rows[0].hidden_id)
      if (!isExist) return _res.sendStatus(404)

      const token = uuidv4()
      await dbQuery(queryList.ADD_LESSON_TOKEN, [token])
      setTimeout(() => {
        dbQuery(queryList.DELETE_LESSON_TOKEN, [token]).catch((err) => {
          console.log('could not remove video token : ', token)
          console.log(err)
        })
      }, 60_000)

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

      const queryResp = await dbQuery(queryList.CHECK_LESSON_TOKEN, [token])
      if (queryResp.rows[0].exists === true) {
        const queryResp = await Promise.all([
          dbQuery(queryList.GET_VIDEO_ID, [publicId]),
          dbQuery(queryList.DELETE_LESSON_TOKEN, [token])
        ])
        if (queryResp[0].rows.length === 0) return _res.sendStatus(400)
        const stream = await createAWSStream(queryResp[0].rows[0].hidden_id)
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
  authenticateToken,
  checkAuthor,
  getLessonType,
  async function (_req: Request, _res: Response, _next: NextFunction) {
    if (_res.locals.lessonType !== 'video') return _res.sendStatus(400)

    try {
      const publicId: string = _req.params.publicId
      const queryResp = await dbQuery(queryList.GET_VIDEO_ID, [publicId])
      if (queryResp.rows.length === 0) return _res.sendStatus(400)

      _next()
    } catch {
      return _res.sendStatus(500)
    }
  },
  uploader.single('file'),
  function (_req: Request, _res: Response) {
    return _res.sendStatus(200)
  }
]

export const readingUploadPost = [
  authenticateToken,
  checkAuthor,
  getLessonType,
  async (_req: Request, _res: Response) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)

    try {
      await uploadReading(_req.params.publicId, _req.body.content)
      return _res.sendStatus(201)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const readingGet = [
  authenticateToken,
  checkLessonAccess,
  getLessonType,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)
    const resp = await getReading(_req.params.publicId)
    if (resp.ok === true) {
      return _res.status(200).json({ content: resp.str })
    } else {
      return _res.sendStatus(404)
    }
  }
]

export const quizUploadPost = [
  body('body').isArray({ min: 1 }).withMessage('quiz must be specified.'),
  body('body.*.title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('title must be specified.'),
  body('body.*.options.content')
    .isArray({ min: 1 })
    .withMessage('options must be specified.'),
  body('body.*.answer')
    .trim()
    .not()
    .isEmpty()
    .withMessage('answer must be specified.'),
  authenticateToken,
  checkAuthor,
  getLessonType,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    if (_res.locals.lessonType !== 'quiz') return _res.sendStatus(400)

    const publicId = _req.params.publicId
    try {
      await dbQuery(queryList.DELETE_QUIZ, [publicId])

      await dbQuery(
        format(
          queryList.ADD_QUIZ,
          _req.body.body.map((q: any, qOrder: number) => [
            publicId,
            qOrder,
            q.title,
            q.answer,
            q.options
          ])
        ),
        []
      )

      return _res.sendStatus(201)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const quizGet = [
  authenticateToken,
  checkLessonAccess,
  getLessonType,
  async (_req: Request, _res: Response) => {
    if (_res.locals.lessonType !== 'quiz') return _res.sendStatus(400)

    try {
      const queryResp = await dbQuery(queryList.GET_QUIZ, [
        _req.params.publicId
      ])

      const quiz = queryResp.rows
      if (_res.locals.accessType === 'student') {
        quiz.forEach((q: any) => {
          delete q.answer
        })
      }

      return _res.status(200).json({ body: quiz })
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const quizSubmitPost = [
  body('answers').isArray({ min: 1 }).withMessage('answers must be specified'),
  authenticateToken,
  checkPurchase,
  getLessonType,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    if (_res.locals.lessonType !== 'quiz') return _res.sendStatus(400)

    try {
      const answers = _req.body.answers
      const accountId: string = _res.locals.accountId
      const publicId = _req.params.publicId

      const queryResp1 = await dbQuery(queryList.GET_QUIZ, [
        _req.params.publicId
      ])

      const quiz = queryResp1.rows

      if (quiz.length !== answers.length) return _res.sendStatus(400)

      let result = 0
      quiz.forEach((q: any, i: number) => {
        q.is_correct = answers[i] === q.answer
        q.submit = answers[i]
        result += Number(q.is_correct)
        delete q.answer
      })

      const queryResp2 = await dbQuery(queryList.GET_QUIZ_RESULT, [
        accountId,
        publicId
      ])

      await dbQuery('begin', [])
      await dbQuery(
        queryResp2.rows.length === 0
          ? queryList.ADD_QUIZ_RESULT
          : queryList.UPDATE_QUIZ_RESULT,
        [accountId, publicId, result, quiz.length]
      )

      const queryResp3 = await dbQuery(queryList.CHECK_COMPLETED, [
        accountId,
        publicId
      ])

      if (queryResp3.rows[0].exists === false) {
        await dbQuery(queryList.MARK_COMPLETED, [accountId, publicId])
      }
      await dbQuery('commit', [])

      return _res.status(200).json({ body: quiz })
    } catch {
      await dbQuery('rollback', [])
      return _res.sendStatus(500)
    }
  }
]

export const quizStatusGet = [
  authenticateToken,
  checkPurchase,
  getLessonType,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId
      const publicId = _req.params.publicId

      const queryResp = await dbQuery(queryList.GET_QUIZ_RESULT, [
        accountId,
        publicId
      ])

      const status = { result: 0, total: 0 }
      if (queryResp.rows.length !== 0) {
        status.result = queryResp.rows[0].result
        status.total = queryResp.rows[0].total
      }

      return _res.status(200).json(status)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const coursePurchasePost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      if (_res.locals.role !== 'admin') return _res.sendStatus(403)

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
          _req.params.courseId
        ])
      }

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const markAsCompletedPost = [
  authenticateToken,
  checkPurchase,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId
      const courseId = _req.params.courseId
      const publicId = _req.params.publicId

      const queryResp = await dbQuery(queryList.GET_LESSON, [publicId])

      if (queryResp.rows.length === 0) return _res.sendStatus(404)
      if (String(queryResp.rows[0].course_id) !== courseId) {
        return _res.sendStatus(400)
      }

      const queryResp2 = await dbQuery(queryList.CHECK_COMPLETED, [
        accountId,
        publicId
      ])

      if (queryResp2.rows[0].exists === true) return _res.sendStatus(200)

      await dbQuery(queryList.MARK_COMPLETED, [accountId, publicId])

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const markAsUncompletedPost = [
  authenticateToken,
  checkPurchase,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId
      const courseId = _req.params.courseId
      const publicId = _req.params.publicId

      const queryResp = await dbQuery(queryList.GET_LESSON, [publicId])

      if (queryResp.rows.length === 0) return _res.sendStatus(404)
      if (String(queryResp.rows[0].course_id) !== courseId) {
        return _res.sendStatus(400)
      }

      await dbQuery(queryList.MARK_UNCOMPLETED, [accountId, publicId])

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const progressGet = [
  authenticateToken,
  checkPurchase,
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

      const queryResp = await dbQuery(queryList.GET_COMPLETED, [
        accountId,
        courseId
      ])

      for (const week of courseContent) {
        for (const lesson of week.content) {
          const completed = queryResp.rows.findIndex(
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
