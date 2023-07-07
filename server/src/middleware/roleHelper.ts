import { type Request, type Response, type NextFunction } from 'express'
const dbConnection = require('../db/connection')
const queries = require('../db/queries')

export const getRole = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId

    if (accountId == null) return _res.sendStatus(401)

    const queryResp = await dbConnection.dbQuery(
      queries.queryList.GET_ACCOUNT_ROLE,
      [accountId]
    )
    if (queryResp.rows.length === 0) return _res.sendStatus(403)

    _res.locals.role = queryResp.rows[0].role
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const checkAuthor = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId
    const courseId: string = _req.params.courseId

    if (accountId == null) return _res.sendStatus(401)
    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp = await dbConnection.dbQuery(
      queries.queryList.CHECK_COURSE_AUTHOR,
      [courseId, accountId]
    )

    if (queryResp.rows[0].exists === false) return _res.sendStatus(403)

    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const checkCourseFullAccess = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId
    const courseId: string = _req.params.courseId

    if (accountId == null) return _res.sendStatus(401)
    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp = await Promise.all([
      dbConnection.dbQuery(queries.queryList.CHECK_COURSE_AUTHOR, [
        courseId,
        accountId
      ]),
      dbConnection.dbQuery(queries.queryList.CHECK_PURCHASE, [
        accountId,
        courseId
      ])
    ])

    // author or bought it
    _res.locals.hasFullAccess =
      Boolean(queryResp[0].rows[0].exists) ||
      Boolean(queryResp[1].rows[0].exists)
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}
