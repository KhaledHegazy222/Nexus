import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
import { generateAccessToken } from '../middleware/authMW'
import { verifyIdToken } from '../util/googleOauth'
import {
  sendVerificationMail,
  sendResetPasswordMail
} from '../middleware/mailMW'
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { body, validationResult } = require('express-validator')

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
      const mail: string = _req.body.mail.toLowerCase()
      const password: string = _req.body.password
      const firstName: string = _req.body.first_name
      const lastName: string = _req.body.last_name
      const hashedPassword: string = await bcrypt.hash(password, 10)

      // check if already exists
      const queryResp = await dbQuery(queryList.GET_ACCOUNT, [mail])
      if (queryResp.rows.length !== 0) {
        return _res.status(400).json({ msg: 'Account already exists' })
      }

      await dbQuery('begin', [])
      await dbQuery(queryList.ADD_ACCOUNT, [
        mail,
        hashedPassword,
        firstName,
        lastName
      ])
      await dbQuery(queryList.ADD_VERIFICATION_ID, [uuidv4()])
      await dbQuery('commit', [])

      return _res.sendStatus(201)
    } catch {
      await dbQuery('rollback', [])
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
      const mail: string = _req.body.mail.toLowerCase()
      const password: string = _req.body.password

      const queryResp = await dbQuery(queryList.GET_ACCOUNT, [mail])
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
            token: generateAccessToken(account.id.toString())
          })
        : _res.sendStatus(401)
    } catch (err) {
      return _res.sendStatus(500)
    }
  }
]

export const googleOauthHandler = [
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const token = _req.headers.authorization as string
      if (token === '') {
        return _res
          .status(400)
          .json({ msg: 'Authorization token not provided!' })
      }

      const accountDetails = await verifyIdToken({ token })
      if (accountDetails == null) {
        return _res.status(400).json({ msg: 'Google account does not exist' })
      }
      if (accountDetails.emailVerified === false) {
        return _res.status(400).json({ msg: 'Google account is not verified' })
      }

      const queryResp = await dbQuery(queryList.GET_ACCOUNT, [
        accountDetails.email
      ])
      if (queryResp.rows.length === 0) {
        // sign in - account doesn't exist in db
        await dbQuery(queryList.ADD_GOOGLE_ACCOUNT, [
          accountDetails.email,
          accountDetails.firstName,
          accountDetails.lastName
        ])
        return _res.sendStatus(201)
      } else {
        // log in - account exists in db
        const existingAccount = queryResp.rows[0]
        if (existingAccount.active === false) {
          await dbQuery(queryList.VERIFY_ACCOUNT, [existingAccount.id])
        }
        return _res.status(200).json({
          token: generateAccessToken(existingAccount.id.toString())
        })
      }
    } catch {
      return _res.sendStatus(500)
    }
  }
]

export const accountSendVerificationPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  sendVerificationMail
]

export const accountVerifyPatch = [
  async (_req: Request, _res: Response) => {
    try {
      const verificationId = _req.query.token?.toString()

      if (verificationId === undefined) return _res.sendStatus(400)

      const queryResp = await dbQuery(queryList.GET_UNVERIFIED_ACCOUNT_ID, [
        verificationId
      ])
      if (queryResp.rows.length === 0) return _res.sendStatus(400)

      const accountId: string = queryResp.rows[0].account_id

      await dbQuery('begin', [])
      await dbQuery(queryList.VERIFY_ACCOUNT, [accountId])
      await dbQuery(queryList.DELETE_VERIFICATION, [accountId])
      await dbQuery('commit', [])

      return _res.status(200).json({
        token: generateAccessToken(accountId)
      })
    } catch {
      await dbQuery('rollback', [])
      return _res.sendStatus(500)
    }
  }
]

export const accountSendResetPasswordPost = [
  body('mail').isEmail().escape().withMessage('invalid email'),
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(_req)
    if (!errors.isEmpty()) {
      return _res.status(400).json({ errors: errors.array() })
    }

    try {
      const mail: string = _req.body.mail.toLowerCase()

      const queryResp1 = await dbQuery(queryList.GET_ACCOUNT_DETAILS_BY_MAIL, [
        mail
      ])
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)

      const accountId: string = queryResp1.rows[0].id

      const queryResp2 = await dbQuery(queryList.GET_RESET_ID, [accountId])

      if (queryResp2.rows.length === 0) {
        const resetId: string = uuidv4()
        await dbQuery(queryList.ADD_RESET_ID, [accountId, resetId])
        _res.locals.resetId = resetId
      } else {
        _res.locals.resetId = queryResp2.rows[0].reset_id
      }

      _next()
    } catch {
      return _res.sendStatus(500)
    }
  },
  sendResetPasswordMail
]

export const accountResetPasswordPatch = [
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
      const resetId = _req.query.token?.toString()
      const password: string = _req.body.password

      if (resetId === undefined) return _res.sendStatus(400)

      const queryResp1 = await dbQuery(queryList.GET_ACCOUNT_ID_BY_RESET_ID, [
        resetId
      ])
      if (queryResp1.rows.length === 0) return _res.sendStatus(404)

      const accountId: string = queryResp1.rows[0].account_id
      const hashedPassword = await bcrypt.hash(password, 10)

      await dbQuery('begin', [])
      await dbQuery(queryList.UPDATE_ACCOUNT_PASSWORD, [
        hashedPassword,
        accountId
      ])
      await dbQuery(queryList.DELETE_RESET_ID, [accountId])
      await dbQuery('commit', [])

      return _res.sendStatus(200)
    } catch {
      await dbQuery('rollback', [])
      return _res.sendStatus(500)
    }
  }
]
