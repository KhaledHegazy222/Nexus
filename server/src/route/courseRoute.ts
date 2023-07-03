const express = require('express')
const courseController = require('../controller/courseController')
const uploadHelper = require('../middleware/uploadHelper')
const router = express.Router()

router.post('/create', courseController.courseCreatePost)
router.patch('/:courseId/edit/content', courseController.courseEditContentPatch)
router.get('/:courseId', courseController.courseDetailsGet)

router.get('/:courseId/video/:videoId', courseController.videoStreamGet)
router.post(
  '/:courseId/video/upload',
  uploadHelper.upload.single('file'),
  courseController.videoUploadPost
)
router.delete('/:courseId/video/delete/:videoId', courseController.videoDelete)

export = router
