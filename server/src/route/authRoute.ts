import {
  accountSignupPost,
  accountLoginPost,
  googleOauthHandler,
  accountSendVerificationPost,
  accountVerifyPatch,
  accountSendResetPasswordPost,
  accountResetPasswordPatch
} from '../controller/authController'
const express = require('express')
const router = express.Router()

router.post('/signup', accountSignupPost)
router.post('/login', accountLoginPost)
router.post('/oauth/google', googleOauthHandler)

router.post('/verify', accountSendVerificationPost)
router.patch('/verify', accountVerifyPatch)

router.post('/reset-password', accountSendResetPasswordPost)
router.patch('/reset-password', accountResetPasswordPatch)

export = router
