import { type Request, type Response, type NextFunction } from 'express'
import { type Result, type ValidationError } from 'express-validator'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
require('dotenv').config()

export const sendVerificationMail = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
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
    const accountDetail: {
      id: number
      mail: string
      role: string
      first_name: string
      last_name: string
    } = queryResp1.rows[0]

    const queryResp2 = await dbQuery(queryList.GET_VERIFICATION_ID, [
      String(accountDetail.id)
    ])
    if (queryResp2.rows.length === 0) return _res.sendStatus(400)

    const verificationId: string = queryResp2.rows[0].verification_id

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_GMAIL,
        pass: process.env.SENDER_PASSWORD
      }
    })
    const mailOptions = {
      from: process.env.SENDER_GMAIL,
      to: mail,
      subject: 'Account Activation - Action Required',
      html: `
        <p>Dear ${accountDetail.first_name} ${accountDetail.last_name},</p>
        <p>Welcome to <b>Nexus</b>! We are delighted to have you on board. Before you can fully access your account and enjoy our services, we need to verify your email address. Please follow the steps below to activate your account:</p>
  
        <ol>
          <li>Click on the following activation link: <a href="${
            process.env.VITE_WEB_ROOT_URL ?? ''
          }?activate=${verificationId}">Activate Account</a><br>
              <small>(Note: The link will expire soon, so please make sure to complete the activation process promptly.)</small>
          </li>
          <li>You will be directed to a page confirming the successful activation of your account.</li>
        </ol>
  
        <p>If the above link does not work, please copy and paste the entire URL into your web browser's address bar.</p>
  
        <p>Once your account is activated, you will have access to all the features and benefits that come with being a member of our platform. We encourage you to explore our offerings and make the most of your experience.</p>
  
        <p>If you did not create an account or believe this email was sent to you in error, please disregard it. No further action is required.</p>
  
        <p>Thank you for choosing <b>Nexus</b>. We look forward to serving you and providing you with an exceptional experience.</p>
        
        <p>Best regards,</p>
        <p>Nexus team</p>`
    }
    transporter.sendMail(mailOptions, (err: any) => {
      if (err != null) console.log(err)
    })

    return _res.sendStatus(200)
  } catch {
    return _res.sendStatus(500)
  }
}

export const sendResetPasswordMail = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const mail: string = _req.body.mail.toLowerCase()
    const resetId: string = _res.locals.resetId

    const queryResp1 = await dbQuery(queryList.GET_ACCOUNT_DETAILS_BY_MAIL, [
      mail
    ])
    if (queryResp1.rows.length === 0) return _res.sendStatus(404)
    const accountDetail: {
      id: number
      mail: string
      role: string
      first_name: string
      last_name: string
    } = queryResp1.rows[0]

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_GMAIL,
        pass: process.env.SENDER_PASSWORD
      }
    })
    const mailOptions = {
      from: process.env.SENDER_GMAIL,
      to: mail,
      subject: 'Password Reset Request - Action Required',
      html: `
      <p>Dear ${accountDetail.first_name} ${accountDetail.last_name},</p>
      <p>We received a request to reset your password for your account with Nexus. To proceed with the password reset process, please follow the instructions below:</p>
  
      <ol>
          <li>Click on the following link to reset your password: <a href="${
            process.env.VITE_WEB_ROOT_URL ?? ''
          }?reset=${resetId}">Reset Password</a><br>
              <small>(Note: The link will expire soon, so please make sure to complete the process promptly.)</small>
          </li>
          <li>You will be directed to a secure page where you can enter a new password for your account.</li>
      </ol>
  
      <p>If you did not initiate this password reset request or believe this email was sent to you in error, please disregard it. Your password will not be changed unless you follow the link and complete the reset process.</p>
  
      <p>Ensuring the security of your account is of utmost importance to us. If you have any concerns or need further assistance, please contact our support team.</p>
  
      <p>Best regards,</p>
      <p>Nexus team<br>`
    }
    transporter.sendMail(mailOptions, (err: any) => {
      if (err != null) console.log(err)
    })

    return _res.sendStatus(200)
  } catch {
    return _res.sendStatus(500)
  }
}

export const sendCertificateRequestMail = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const queryResp = await Promise.all([
      dbQuery(queryList.GET_STUDENT_ACCOUNT_DETAILS_BY_ID, [
        _res.locals.accountId
      ]),
      dbQuery(queryList.GET_COURSE, [_req.params.courseId])
    ])
    if (queryResp[0].rows.length === 0 || queryResp[1].rows.length === 0) {
      return _res.sendStatus(404)
    }

    const accountDetail: {
      id: number
      mail: string
      role: string
      first_name: string
      last_name: string
    } = queryResp[0].rows[0]

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_GMAIL,
        pass: process.env.SENDER_PASSWORD
      }
    })
    const mailOptions = {
      from: process.env.SENDER_GMAIL,
      to: process.env.CERTIFICATE_REQUEST_GMAIL,
      subject: 'Certificate Request',
      html: `
      <p>Dear Admin,</p>
      <p>We received a certificate request from student at Nexus. Here's the needed data</p>
      
      <p>student data:</p>
      <ul>
          <li>ID: ${accountDetail.id}</li>
          <li>Name: ${accountDetail.first_name} ${accountDetail.last_name}</li>
          <li>mail: ${accountDetail.mail}</li>
      </ul>

      <p><a href="${String(process.env.VITE_WEB_ROOT_URL)}/course/${String(
        queryResp[1].rows[0].id
      )}">course data:</a></p>
      <ul>
          <li>ID: ${String(queryResp[1].rows[0].id)}</li>
          <li>Name: ${String(queryResp[1].rows[0].title)}</li>
          <li>field: ${String(queryResp[1].rows[0].field)}</li>
          <li>department: ${String(queryResp[1].rows[0].department)}</li>
      </ul>
  
      <p>If you believe this email was sent to you in error, please disregard it.</p>
  
      <p>Best regards,</p>
      <p>Nexus team<br>`
    }
    transporter.sendMail(mailOptions, (err: any) => {
      if (err != null) console.log(err)
    })

    return _res.sendStatus(200)
  } catch {
    return _res.sendStatus(500)
  }
}
