import { type Request, type Response, type NextFunction } from 'express'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'

export const getRole = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId

    if (accountId == null) return _res.sendStatus(401)

    const queryResp = await dbQuery(queryList.GET_ACCOUNT_ROLE, [accountId])
    if (queryResp.rows.length === 0) return _res.sendStatus(403)

    _res.locals.role = queryResp.rows[0].role
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}
