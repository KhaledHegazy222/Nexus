import { type Request, type Response } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { body, validationResult } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { authenticateToken } from '../middleware/authMW'
import { checkPurchase } from '../middleware/courseMW'

export const reviewCreatePost = [
  body('course_id').isInt().withMessage('course_id must be an int'),
  body('rate')
    .optional({ checkFalsy: true })
    .trim()
    .isFloat({ min: 0, max: 5 })
    .withMessage('rate must be a decimal from 0 to 5'),
  authenticateToken,
  checkPurchase,
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      await dbQuery('begin', [])
      await dbQuery(queryList.DELETE_REVIEW, [
        _res.locals.accountId,
        _req.body.course_id
      ])
      await dbQuery(queryList.ADD_REVIEW, [
        _res.locals.accountId,
        _req.body.course_id,
        _req.body.content,
        _req.body.rate
      ])
      await dbQuery('commit', [])

      _res.sendStatus(201)
    } catch (err) {
      await dbQuery('rollback', [])
      console.log(err)
      _res.sendStatus(500)
    }
  }
]

export const reviewListGet = async (
  _req: Request,
  _res: Response
): Promise<void> => {
  try {
    const courseId = _req.query.courseid?.toString()

    if (courseId === undefined || courseId === '') {
      const queryResp = await dbQuery(queryList.GET_REVIEWS, [])
      _res.status(200).json(queryResp.rows)
      return
    }

    if (!/^[0-9]+$/.test(courseId)) {
      _res.sendStatus(400)
      return
    }

    const queryResp = await dbQuery(queryList.GET_COURSE_REVIEWS, [courseId])

    _res.status(200).json(queryResp.rows)
  } catch (err) {
    console.log(err)
    _res.sendStatus(500)
  }
}
