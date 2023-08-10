import { type Request } from 'express'
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { S3ReadStream } from 's3-readstream'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()

const BUCKET = process.env.BUCKET
const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY ?? '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
  }
})

export const deleteElement = async (key: string): Promise<void> => {
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    })
  )
}

export const getReading = async (key: string): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  })

  try {
    const response = await client.send(command)
    if (response.Body === undefined) return { str: '', ok: false }

    const str = await response.Body.transformToString()
    return { str, ok: true }
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'NoSuchKey') return { str: '', ok: false }
    }
    return { str: '', ok: false }
  }
}

export const uploadReading = async (
  key: string,
  content: string
): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content
  })
  await client.send(command)
}

export const createAWSStream = async (
  videoId: string
): Promise<S3ReadStream> => {
  const bucketParams = {
    Bucket: BUCKET, // S3 Bucket Path
    Key: videoId // S3 file
  }
  // Grab the headObject like normal to get the length of the file
  const headObjectCommand = new HeadObjectCommand(bucketParams)
  const headObject = await client.send(headObjectCommand)

  // Because AWS sdk is now modular, pass in the `GetObjectCommand` command object
  const options = {
    s3: client,
    command: new GetObjectCommand(bucketParams),
    maxLength: headObject.ContentLength ?? 0,
    byteRange: 1024 * 1024 // 1 MiB (optional - defaults to 64kb)
  }

  // Instantiate the S3ReadStream in place of (await S3Client.send(new GetObjectCommand())).Body
  const stream = new S3ReadStream(options)
  return stream
}

export const imageUploader = multer({
  storage: multerS3({
    s3: client,
    bucket: BUCKET,
    acl: 'public-read',
    metadata: function (_req: Request, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname })
    },
    key: async function (_req: Request, _file: any, cb: any) {
      console.log('uploading...')
      cb(null, 'image/' + _req.params.imageId)
    }
  })
})

export const videoUploader = multer({
  storage: multerS3({
    s3: client,
    bucket: BUCKET,
    metadata: function (_req: Request, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname })
    },
    key: async function (_req: Request, _file: any, cb: any) {
      const publicId: string = _req.params.publicId
      const queryResp = await dbQuery(queryList.GET_VIDEO_ID, [publicId])
      console.log('uploading...')
      cb(null, 'lesson/' + String(queryResp.rows[0].hidden_id))
    }
  })
})

export const checkVideoExist = async (key: string): Promise<boolean> => {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key
      })
    )
    return true
  } catch (err) {
    return false
  }
}
