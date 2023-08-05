import {
  streamTokenGet,
  videoUploadPost,
  videoStreamGet,
  readingGet,
  readingUploadPost,
  quizUploadPost,
  quizSubmitPost,
  quizGet,
  markAsCompletedPost,
  markAsUncompletedPost
} from '../controller/lessonController'
const express = require('express')

const router = express.Router()

router.post('/:publicId', markAsCompletedPost)
router.delete('/:publicId', markAsUncompletedPost)

router.post('/video/:publicId', videoUploadPost)
router.get('/video/:publicId/token', streamTokenGet)
router.get('/video/:publicId', videoStreamGet)

router.post('/reading/:publicId', readingUploadPost)
router.get('/reading/:publicId', readingGet)

router.post('/quiz/:publicId', quizUploadPost)
router.post('/quiz/:publicId/submit', quizSubmitPost)
router.get('/quiz/:publicId', quizGet)

export = router
