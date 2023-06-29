import { type Request, type Response, type NextFunction } from 'express'
const dbConnection = require('../db/connection')
const queries = require('../db/queries')

export const getRole = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  const accountId: string = _res.locals.accountId

  if (accountId == null) return _res.sendStatus(401)

  const queryResp = await dbConnection.dbQuery(
    queries.queryList.GET_ACCOUNT_ROLE,
    [accountId]
  )
  if (queryResp.rows.length === 0) return _res.sendStatus(403)

  _res.locals.role = queryResp.rows[0].role
  _next()
}
