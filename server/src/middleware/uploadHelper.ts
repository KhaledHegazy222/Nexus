import { type Request } from 'express'
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../s3Client')
const dbConnection = require('../db/connection')
const queries = require('../db/queries')

export const upload = multer({
  storage: multerS3({
    s3: s3.client,
    bucket: s3.BUCKET,
    metadata: function (_req: Request, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname })
    },
    key: async function (_req: Request, _file: any, cb: any) {
      const publicId: string = _req.params.publicId
      const queryResp = await dbConnection.dbQuery(queries.queryList.GET_S3ID, [
        publicId
      ])
      console.log('to upload')
      cb(null, queryResp.rows[0].hidden_id)
      console.log('uploaded')
    }
  })
})
