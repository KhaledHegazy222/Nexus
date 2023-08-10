import {
  accountDetailsGet,
  accountDetailPost,
  accountImagePost,
  accountPublicDetailsGet
} from '../controller/memberController'
const express = require('express')
const router = express.Router()

router.get('/details', accountDetailsGet)
router.post('/details', accountDetailPost)
router.post('/details/image/:imageId', accountImagePost)
router.get('/details/:accountId', accountPublicDetailsGet)

export = router
