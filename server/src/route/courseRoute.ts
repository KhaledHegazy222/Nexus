const express = require('express')
const courseController = require('../controller/courseController')

const router = express.Router()

router.post('/create', courseController.courseCreatePost)
router.put('/:courseId', courseController.courseEditPut)
router.get('/:courseId', courseController.courseDetailsGet)
router.patch('/:courseId/content', courseController.courseEditContentPatch)
router.post('/:courseId/publish', courseController.coursePublishPost)

router.get('/:courseId/video/:publicId', courseController.streamTokenGet)
router.post('/:courseId/video/:publicId', courseController.videoUploadPost)
router.get('/video/:publicId/:token', courseController.videoStreamGet)

router.get('/:courseId/reading/:publicId', courseController.readingGet)
router.post('/:courseId/reading/:publicId', courseController.readingUploadPost)

router.post('/:courseId/quiz/:publicId', courseController.quizUploadPost)
router.get('/:courseId/quiz/:publicId', courseController.quizGet)

router.delete('/:courseId/lesson/:publicId', courseController.lessonDelete)

export = router
