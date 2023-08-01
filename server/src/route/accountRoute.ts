import {
  accountSignupPost,
  accountLoginPost,
  googleOauthHandler,
  accountDetailsGet,
  accountDetailPost,
  accountPublicDetailsGet,
  accountSendVerificationPost,
  accountVerifyPost,
  accountSendResetPasswordPost,
  accountResetPasswordPost
} from '../controller/accountController'
const express = require('express')
const router = express.Router()

router.post('/signup', accountSignupPost)
router.post('/login', accountLoginPost)
router.post('/oauth/google', googleOauthHandler)
router.get('/details', accountDetailsGet)
router.post('/details', accountDetailPost)
router.get('/details/:accountId', accountPublicDetailsGet)

router.post('/verify', accountSendVerificationPost)
router.post('/verify/:verificationId', accountVerifyPost)
router.post('/reset-password', accountSendResetPasswordPost)
router.post('/reset-password/:resetId', accountResetPasswordPost)

export = router
