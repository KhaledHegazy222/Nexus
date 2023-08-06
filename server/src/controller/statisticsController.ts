import { type Request, type Response } from 'express'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { getRole } from '../middleware/roleMW'
import { authenticateToken } from '../middleware/authMW'

export const statsGet = [
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response) => {
    if (_res.locals.role !== 'admin') return _res.sendStatus(401)
    try {
      let date = _req.query.after?.toString()
      if (date === undefined || isNaN(Date.parse(date))) date = '2020-01-01'

      const resp = {
        brief: {
          user_count: '',
          course_count: '',
          review_count: '',
          total_income: '',
          enroll_count: ''
        },
        courses: {}
      }

      const queryResp = await Promise.all([
        dbQuery(queryList.ACCOUNT_COUNT, [date]),
        dbQuery(queryList.COURSE_COUNT, [date]),
        dbQuery(queryList.REVIEWS_COUNT, [date]),
        dbQuery(queryList.ENROLLS_COUNT, [date]),
        dbQuery(queryList.TOTAL_INCOME, [date])
      ])

      resp.brief.user_count = queryResp[0].rows[0].count
      resp.brief.course_count = queryResp[1].rows[0].count
      resp.brief.review_count = queryResp[2].rows[0].count
      resp.brief.enroll_count = queryResp[3].rows[0].count
      resp.brief.total_income = queryResp[4].rows[0].sum ?? '0'

      const queryResp2 = await dbQuery(queryList.EXPLORE_COURSES, [])
      resp.courses = queryResp2.rows

      return _res.status(200).json(resp)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
