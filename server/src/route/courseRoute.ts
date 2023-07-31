import {
  courseMineGet,
  exploreGet,
  courseEditPut,
  courseCreatePost,
  courseDetailsGet,
  courseEditContentPatch,
  coursePublishPost,
  streamTokenGet,
  videoUploadPost,
  videoStreamGet,
  readingGet,
  readingUploadPost,
  quizUploadPost,
  quizSubmitPost,
  quizStatusGet,
  quizGet,
  markAsCompletedPost,
  markAsUncompletedPost,
  progressGet,
  coursePurchasePost
} from '../controller/courseController'
const express = require('express')

const router = express.Router()

router.get('/', courseMineGet)
router.get('/explore', exploreGet)
router.post('/create', courseCreatePost)
router.put('/:courseId', courseEditPut)
router.get('/:courseId', courseDetailsGet)
router.patch('/:courseId/content', courseEditContentPatch)
router.post('/:courseId/publish', coursePublishPost)

router.get('/:courseId/video/:publicId', streamTokenGet)
router.post('/:courseId/video/:publicId', videoUploadPost)
router.get('/video/:publicId/:token', videoStreamGet)

router.get('/:courseId/reading/:publicId', readingGet)
router.post('/:courseId/reading/:publicId', readingUploadPost)

router.post('/:courseId/quiz/:publicId', quizUploadPost)
router.post('/:courseId/quiz/:publicId/submit', quizSubmitPost)
router.get('/:courseId/quiz/:publicId/status', quizStatusGet)
router.get('/:courseId/quiz/:publicId', quizGet)

router.post('/:courseId/lesson/:publicId/completed', markAsCompletedPost)
router.post('/:courseId/lesson/:publicId/uncompleted', markAsUncompletedPost)
router.get('/:courseId/progress', progressGet)

router.post('/:courseId', coursePurchasePost)

export = router
