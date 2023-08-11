import {
  exploreGet,
  courseEditPut,
  courseCreatePost,
  courseDetailsGet,
  courseEditContentPatch,
  coursePublishPatch,
  courseImagePost,
  progressGet,
  courseCertificateGet,
  coursePurchasePost
} from '../controller/courseController'
const express = require('express')

const router = express.Router()

router.post('', courseCreatePost)
router.post('/:courseId', coursePurchasePost)

router.put('/:courseId', courseEditPut)
router.patch('/:courseId', courseEditContentPatch)
router.patch('/:courseId/publish', coursePublishPatch)
router.post('/:courseId/image/:imageId', courseImagePost)

router.get('', exploreGet)
router.get('/:courseId', courseDetailsGet)
router.get('/:courseId/certificate', courseCertificateGet)
router.get('/:courseId/progress', progressGet)

export = router
