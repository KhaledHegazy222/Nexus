import { type Request } from 'express'
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../s3Client')

export const upload = multer({
  storage: multerS3({
    s3: s3.client,
    bucket: s3.BUCKET,
    metadata: function (_req: Request, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (_req: Request, file: any, cb: any) {
      console.log('to upload')
      // name
      cb(null, file.originalname)
      console.log('uploaded')
    }
  })
})
