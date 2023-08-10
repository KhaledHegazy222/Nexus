import { type Request, type Response, type NextFunction } from 'express'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { authenticateToken } from '../middleware/authMW'
import { getRole } from '../middleware/roleMW'
import { imageUploader } from '../util/awsInterface'

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
  getRole,
  async (_req: Request, _res: Response) => {
    try {
      if (_res.locals.role === 'student') return _res.sendStatus(403)

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

export const accountImagePost = [
  authenticateToken,
  getRole,
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      if (_res.locals.role === 'student') return _res.sendStatus(403)

      const accountId = _res.locals.accountId
      const imageId = _req.params.imageId

      const queryResp = await dbQuery(
        queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID,
        [accountId]
      )
      if (queryResp.rows.length === 0) {
        await dbQuery(queryList.ADD_INSTRUCTOR_IMAGE, [accountId, imageId])
      } else if (queryResp.rows[0].pic_id === null) {
        await dbQuery(queryList.UPDATE_INSTRUCTOR_IMAGE, [accountId, imageId])
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
      accData.bio = null
      accData.image = null
      accData.contacts = {}
      accData.courses = []

      const queryResp2 = await Promise.all([
        dbQuery(queryList.GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID, [accountId]),
        dbQuery(queryList.GET_PUBLISHED_INSTRUCTOR_COURSES, [accountId])
      ])

      if (queryResp2[0].rows.length !== 0) {
        accData.bio = queryResp2[0].rows[0].bio
        accData.contacts = queryResp2[0].rows[0].contacts
        accData.image = queryResp2[0].rows[0].pic_id
      }
      accData.courses = queryResp2[1].rows

      return _res.status(200).json(accData)
    } catch {
      return _res.sendStatus(500)
    }
  }
]
