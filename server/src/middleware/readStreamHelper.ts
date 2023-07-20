import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { S3ReadStream } from 's3-readstream'
require('dotenv').config()

export const createAWSStream = async (
  videoId: string
): Promise<S3ReadStream> => {
  // Pass in your AWS S3 credentials
  const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY ?? '',
      secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
    }
  })
  const bucketParams = {
    Bucket: process.env.BUCKET, // S3 Bucket Path
    Key: videoId // S3 file
  }
  // Grab the headObject like normal to get the length of the file
  const headObjectCommand = new HeadObjectCommand(bucketParams)
  const headObject = await s3.send(headObjectCommand)

  // Because AWS sdk is now modular, pass in the `GetObjectCommand` command object
  const options = {
    s3,
    command: new GetObjectCommand(bucketParams),
    maxLength: headObject.ContentLength ?? 0,
    byteRange: 1024 * 1024 // 1 MiB (optional - defaults to 64kb)
  }

  // Instantiate the S3ReadStream in place of (await S3Client.send(new GetObjectCommand())).Body
  const stream = new S3ReadStream(options)
  return stream
}
