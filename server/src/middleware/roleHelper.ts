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
    const publicId: string = _req.params.publicId

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
      ]),
      dbConnection.dbQuery(queries.queryList.GET_COURSE_CONTENT, [courseId])
    ])
    // author or bought it
    let hasAccess: boolean =
      Boolean(queryResp[0].rows[0].exists) ||
      Boolean(queryResp[1].rows[0].exists)

    // is lesson public ?
    if (queryResp[2].rows.length !== 0) {
      const field = queryResp[2].rows[0].content.fields.filter(
        (field: any) => field.id === publicId
      )
      if (field.length !== 0) {
        hasAccess = hasAccess || field[0].public === 'true'
      }
    }

    if (!hasAccess) return _res.sendStatus(403)
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}
