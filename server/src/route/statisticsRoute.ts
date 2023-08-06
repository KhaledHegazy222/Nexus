import { statsGet } from '../controller/statisticsController'
const express = require('express')
const router = express.Router()

router.get('', statsGet)

export = router
