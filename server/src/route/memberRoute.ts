import {
  accountDetailsGet,
  accountDetailPost,
  accountPublicDetailsGet
} from '../controller/memberController'
const express = require('express')
const router = express.Router()

router.get('/details', accountDetailsGet)
router.post('/details', accountDetailPost)
router.get('/details/:accountId', accountPublicDetailsGet)

export = router
