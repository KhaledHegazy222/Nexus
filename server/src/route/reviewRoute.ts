import { reviewCreatePost, reviewListGet } from '../controller/reviewController'
const express = require('express')
const router = express.Router()

router.post('', reviewCreatePost)
router.get('/filters', reviewListGet)

export = router
