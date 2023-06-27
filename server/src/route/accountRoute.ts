const express = require('express')
const accountController = require('../controller/accountController')

const router = express.Router()

router.post('/signup', accountController.accountSignupPost)
router.post('/login', accountController.accountLoginPost)
router.post('/oauth/google', accountController.googleOauthHandler)
router.get('/details', accountController.accountDetailsGet)

router.post('/verify', accountController.accountSendVerificationPost)
router.post('/verify/:verificationId', accountController.accountVerifyPost)
router.post('/reset-password', accountController.accountSendResetPasswordPost)
router.post(
  '/reset-password/:resetId',
  accountController.accountResetPasswordPost
)

export = router
