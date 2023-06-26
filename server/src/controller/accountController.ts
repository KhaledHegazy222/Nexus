import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { body, validationResult } = require('express-validator')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')
const authHelper = require('../middleware/authHelper')
const mailHelper = require('../middleware/mailHelper')

export const accountSignupPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  body('password')
    .isLength({ min: 6 })
    .escape()
    .withMessage('password must be at least 6 length'),
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('first name must be specified.'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('last name must be specified.'),
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      const mail: string = _req.body.mail
      const password: string = _req.body.password
      const firstName: string = _req.body.first_name
      const lastName: string = _req.body.last_name
      const hashedPassword: string = await bcrypt.hash(password, 10)

      // check if already exists
      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_ACCOUNT,
        [mail]
      )
      if (queryResp.rows.length !== 0) {
        _res.status(400).json({ msg: 'Account already exists' })
      }

      await dbConnection.dbQuery('begin')
      await dbConnection.dbQuery(queries.queryList.ADD_ACCOUNT, [
        mail,
        hashedPassword,
        firstName,
        lastName
      ])
      await dbConnection.dbQuery(queries.queryList.ADD_VERIFICATION_ID, [
        uuidv4()
      ])
      await dbConnection.dbQuery('commit')

      return _res.sendStatus(201)
    } catch {
      await dbConnection.dbQuery('rollback')
      return _res.sendStatus(500)
    }
  }
]

export const accountLoginPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  body('password').escape(),
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }
    try {
      const mail: string = _req.body.mail
      const password: string = _req.body.password

      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_ACCOUNT,
        [mail]
      )
      if (queryResp.rows.length === 0) return _res.sendStatus(404)

      const account = queryResp.rows[0]
      if (account.active === false) {
        return _res.status(400).json({ msg: 'Account is not activated' })
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        account.password
      )

      return isPasswordValid
        ? _res.status(200).json({
            token: authHelper.generateAccessToken(account.id.toString())
          })
        : _res.sendStatus(401)
    } catch (err) {
      return _res.sendStatus(500)
    }
  }
]

export const accountDetailsGet = [
  authHelper.authenticateToken,
  async (_req: Request, _res: Response) => {
    try {
      const accountId: string = _res.locals.accountId

      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_ACCOUNT_DETAILS_BY_ID,
        [accountId]
      )
      if (queryResp.rows.length === 0) return _res.sendStatus(404)

      return _res.status(200).json(queryResp.rows[0])
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const accountSendVerificationPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  mailHelper.sendVerificationMail,
  (_req: Request, _res: Response) => _res.sendStatus(200)
]

export const accountVerifyPost = [
  async (_req: Request, _res: Response) => {
    try {
      const verificationId: string = _req.params.verificationId

      const queryResp = await dbConnection.dbQuery(
        queries.queryList.GET_UNVERIFIED_ACCOUNT_ID,
        [verificationId]
      )
      if (queryResp.rows.length === 0) return _res.sendStatus(400)

      const accountId: string = queryResp.rows[0].account_id

      await dbConnection.dbQuery('begin')
      await dbConnection.dbQuery(queries.queryList.VERIFY_ACCOUNT, [accountId])
      await dbConnection.dbQuery(queries.queryList.DELETE_VERIFICATION, [
        accountId
      ])
      await dbConnection.dbQuery('commit')

      return _res.status(200).json({
        token: authHelper.generateAccessToken(accountId)
      })
    } catch {
      await dbConnection.dbQuery('rollback')
      return _res.sendStatus(500)
    }
  }
]

export const accountSendResetPasswordPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  // eslint-disable-next-line consistent-return
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      const { mail } = _req.body

      const queryResp1 = await dbConnection.dbQuery(
        queries.queryList.GET_ACCOUNT_DETAILS_BY_MAIL,
        [mail]
      )
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)

      const accountId: number = queryResp1.rows[0].id

      const queryResp2 = await dbConnection.dbQuery(
        queries.queryList.GET_RESET_ID,
        [accountId]
      )

      if (queryResp2.rows.length === 0) {
        const resetId: string = uuidv4()
        await dbConnection.dbQuery(queries.queryList.ADD_RESET_ID, [
          accountId,
          resetId
        ])
        _res.locals.resetId = resetId
      } else {
        _res.locals.resetId = queryResp2.rows[0].reset_id
      }

      _next()
    } catch {
      return _res.sendStatus(500)
    }
  },
  mailHelper.sendResetPasswordMail,
  (_req: Request, _res: Response) => _res.sendStatus(200)
]

export const accountResetPasswordPost = [
  body('password')
    .isLength({ min: 6 })
    .escape()
    .withMessage('password must be at least 6 length'),
  async (_req: Request, _res: Response) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }
    try {
      const resetId: string = _req.params.resetId
      const password: string = _req.body.password

      const queryResp1 = await dbConnection.dbQuery(
        queries.queryList.GET_ACCOUNT_ID_BY_RESET_ID,
        [resetId]
      )
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)

      const accountId: number = queryResp1.rows[0].account_id
      const hashedPassword = await bcrypt.hash(password, 10)

      await dbConnection.dbQuery('begin')
      await dbConnection.dbQuery(queries.queryList.UPDATE_ACCOUNT_PASSWORD, [
        hashedPassword,
        accountId
      ])
      await dbConnection.dbQuery(queries.queryList.DELETE_RESET_ID, [accountId])
      await dbConnection.dbQuery('commit')

      return _res.sendStatus(200)
    } catch {
      await dbConnection.dbQuery('rollback')
      return _res.sendStatus(500)
    }
  }
]
