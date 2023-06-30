const express = require('express')
const courseController = require('../controller/courseController')
const router = express.Router()

router.post('/create', courseController.courseCreatePost)
router.patch('/:courseId/edit/content', courseController.courseEditContentPatch)
router.get('/:courseId', courseController.courseDetailsGet)

export = router