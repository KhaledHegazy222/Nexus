const express = require('express')
const courseController = require('../controller/courseController')

const router = express.Router()

router.post('/create', courseController.courseCreatePost)
router.patch('/:courseId/edit/content', courseController.courseEditContentPatch)
router.get('/:courseId', courseController.courseDetailsGet)
router.post('/:courseId/publish', courseController.coursePublishPost)

router.get('/:courseId/video/:videoId', courseController.videoStreamGet)
router.post(
  '/:courseId/video/upload/:publicId',
  courseController.videoUploadPost
)
router.delete('/:courseId/video/delete/:publicId', courseController.videoDelete)

export = router
