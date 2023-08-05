import { type Request, type Response } from 'express'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { authenticateToken } from '../middleware/authMW'

export const accountDetailsGet = [
  authenticateToken,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId

      const queryResp1 = await dbQuery(
        queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID,
        [accountId]
      )
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)

      const accData = queryResp1.rows[0]

      if (queryResp1.rows[0].role === 'student') {
        const queryResp2 = await dbQuery(queryList.GET_STUDENT_COURSES, [
          accountId
        ])
        accData.courses = queryResp2.rows
      } else {
        accData.bio = ''
        accData.contacts = {}

        const queryResp3 = await dbQuery(
          queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID,
          [accountId]
        )
        if (queryResp3.rows.length !== 0) {
          accData.bio = queryResp3.rows[0].bio
          accData.contacts = queryResp3.rows[0].contacts
        }

        const queryResp2 = await dbQuery(queryList.GET_INSTRUCTOR_COURSES, [
          accountId
        ])
        accData.courses = queryResp2.rows
      }

      return _res.status(200).json(accData)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const accountDetailPost = [
  authenticateToken,
  async (_req: Request, _res: Response) => {
    try {
      const queryResp = await dbQuery(queryList.CHECK_INSTRUCTOR_DATA, [
        _res.locals.accountId
      ])

      if (queryResp.rows[0].exists === false) {
        await dbQuery(queryList.ADD_INSTRUCTOR_DATA, [
          _res.locals.accountId,
          _req.body.bio,
          _req.body.contacts
        ])
      } else {
        await dbQuery(queryList.UPDATE_INSTRUCTOR_DATA, [
          _req.body.bio,
          _req.body.contacts,
          _res.locals.accountId
        ])
      }

      return _res.sendStatus(200)
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const accountPublicDetailsGet = [
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _req.params.accountId

      const queryResp1 = await dbQuery(
        queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID,
        [accountId]
      )
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)
      if (queryResp1.rows[0].role === 'student') return _res.sendStatus(403)

      const accData = queryResp1.rows[0]
      accData.bio = ''
      accData.contacts = {}
      accData.courses = []

      const queryResp2 = await Promise.all([
        dbQuery(queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID, [accountId]),
        dbQuery(queryList.GET_PUBLISHED_INSTRUCTOR_COURSES, [accountId])
      ])

      if (queryResp2[0].rows.length !== 0) {
        accData.bio = queryResp2[0].rows[0].bio
        accData.contacts = queryResp2[0].rows[0].contacts
      }
      accData.courses = queryResp2[1].rows

      return _res.status(200).json(accData)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
