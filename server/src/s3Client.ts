import { S3Client } from '@aws-sdk/client-s3'
require('dotenv').config()

export const BUCKET = process.env.BUCKET

export const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY ?? '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
  }
})
