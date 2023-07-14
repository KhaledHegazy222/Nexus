const express = require('express')
const courseController = require('../controller/courseController')

const router = express.Router()

router.post('/create', courseController.courseCreatePost)
router.put('/:courseId', courseController.courseEditPut)
router.get('/:courseId', courseController.courseDetailsGet)
router.patch('/:courseId/edit/content', courseController.courseEditContentPatch)
router.post('/:courseId/publish', courseController.coursePublishPost)

router.get('/:courseId/video/:publicId', courseController.streamTokenGet)
router.get('/video/:publicId/:token', courseController.videoStreamGet)
router.post(
  '/:courseId/video/upload/:publicId',
  courseController.videoUploadPost
)

router.get('/:courseId/reading/:publicId', courseController.readingGet)
router.post(
  '/:courseId/reading/upload/:publicId',
  courseController.readingUploadPost
)

router.delete(
  '/:courseId/lesson/delete/:publicId',
  courseController.lessonDelete
)

export = router
