import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { authenticateToken } from '../middleware/authMW'
import {
  checkAuthor,
  checkLessonAccess,
  getLessonData,
  checkPurchase
} from '../middleware/courseMW'
import {
  videoUploader,
  getReading,
  uploadReading,
  createAWSStream,
  checkVideoExist
} from '../util/awsInterface'
const format = require('pg-format')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')

export const streamTokenGet = [
  authenticateToken,
  checkLessonAccess,
  getLessonData,
  async function (_req: Request, _res: Response) {
    if (_res.locals.lessonType !== 'video') return _res.sendStatus(400)

    try {
      const publicId = _req.params.publicId
      const queryResp = await dbQuery(queryList.GET_VIDEO_ID, [publicId])
      if (queryResp.rows.length === 0) return _res.sendStatus(403)

      const isExist = await checkVideoExist(
        'lesson/' + String(queryResp.rows[0].hidden_id)
      )
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
      const token = _req.query.token?.toString()

      if (token === undefined) return _res.sendStatus(403)

      const queryResp = await dbQuery(queryList.CHECK_LESSON_TOKEN, [token])
      if (queryResp.rows[0].exists === true) {
        const queryResp = await Promise.all([
          dbQuery(queryList.GET_VIDEO_ID, [publicId]),
          dbQuery(queryList.DELETE_LESSON_TOKEN, [token])
        ])
        if (queryResp[0].rows.length === 0) return _res.sendStatus(400)
        const stream = await createAWSStream(
          'lesson/' + String(queryResp[0].rows[0].hidden_id)
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
  authenticateToken,
  getLessonData,
  checkAuthor,
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
  videoUploader.single('file'),
  function (_req: Request, _res: Response) {
    return _res.sendStatus(200)
  }
]

export const readingUploadPost = [
  authenticateToken,
  getLessonData,
  checkAuthor,
  async (_req: Request, _res: Response) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)

    try {
      await uploadReading('lesson/' + _req.params.publicId, _req.body.content)
      return _res.sendStatus(201)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const readingGet = [
  authenticateToken,
  checkLessonAccess,
  getLessonData,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    if (_res.locals.lessonType !== 'reading') return _res.sendStatus(400)
    const resp = await getReading('lesson/' + _req.params.publicId)
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
  getLessonData,
  checkAuthor,
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
  getLessonData,
  async (_req: Request, _res: Response) => {
    if (_res.locals.lessonType !== 'quiz') return _res.sendStatus(400)

    try {
      const queryResp1 = await dbQuery(queryList.GET_QUIZ, [
        _req.params.publicId
      ])

      const quiz = queryResp1.rows
      if (_res.locals.accessType === 'student') {
        quiz.forEach((q: any) => {
          delete q.answer
        })

        const queryResp2 = await dbQuery(queryList.GET_QUIZ_RESULT, [
          _res.locals.accountId,
          _req.params.publicId
        ])

        let result = 0
        let total = 0
        if (queryResp2.rows.length !== 0) {
          result = queryResp2.rows[0].result
          total = queryResp2.rows[0].total
        }

        return _res.status(200).json({
          questions: quiz,
          last_result: result,
          total
        })
      }

      return _res.status(200).json({ questions: quiz })
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const quizSubmitPost = [
  body('answers').isArray({ min: 1 }).withMessage('answers must be specified'),
  authenticateToken,
  getLessonData,
  checkPurchase,
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

export const markAsCompletedPost = [
  authenticateToken,
  getLessonData,
  checkPurchase,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId
      const publicId = _req.params.publicId

      const queryResp = await dbQuery(queryList.GET_LESSON, [publicId])

      if (queryResp.rows.length === 0) return _res.sendStatus(404)

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
  getLessonData,
  checkPurchase,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId
      const publicId = _req.params.publicId

      const queryResp = await dbQuery(queryList.GET_LESSON, [publicId])

      if (queryResp.rows.length === 0) return _res.sendStatus(404)

      await dbQuery(queryList.MARK_UNCOMPLETED, [accountId, publicId])

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
