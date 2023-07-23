import { type Request, type Response, type NextFunction } from 'express'
require('dotenv').config()
const jwt = require('jsonwebtoken')

export const authenticateToken = (
  _req: Request,
  _res: Response,
  _next: NextFunction
): any => {
  const authHeader = _req.headers.authorization
  if (authHeader == null) return _res.sendStatus(401)
  const token = authHeader.split(' ')[1]
  if (token == null) return _res.sendStatus(401)

  try {
    const decoded: string = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    )
    _res.locals.accountId = decoded
    _next()
  } catch {
    return _res.sendStatus(403)
  }
}

export const generateAccessToken = (accountId: string): string =>
  jwt.sign(accountId, process.env.ACCESS_TOKEN_SECRET)
