import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { type Request, type Response } from 'express'
import express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const authRoute = require('./route/authRoute')
const memberRoute = require('./route/memberRoute')
const courseRoute = require('./route/courseRoute')
const lessonRoute = require('./route/lessonRoute')
const reviewRoute = require('./route/reviewRoute')
const statisticsRoute = require('./route/statisticsRoute')

const app = express()

app.use(cors())
// parse application/json parser
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/member', memberRoute)
app.use('/api/v1/course', courseRoute)
app.use('/api/v1/lesson', lessonRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/statistics', statisticsRoute)

// temp
app.use('/api/v1/s3/list', [
  async (_req: Request, _res: Response) => {
    try {
      const client = new S3Client({
        region: process.env.REGION,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY ?? '',
          secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
        }
      })

      const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        // The default and maximum number of keys returned is 1000. This limits it to
        // one for demonstration purposes.
        MaxKeys: 1
      })
      let isTruncated = true
      let contents = ''

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await client.send(command)
        if (Contents == null) break
        const contentsList: string = Contents.map(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          (c: any) => `   ${c.Key}`
        ).join('\n')
        contents += contentsList
        isTruncated = IsTruncated ?? true
        command.input.ContinuationToken = NextContinuationToken
      }
      return _res.status(200).json(contents)
    } catch (err: any) {
      console.log(err)
      _res.sendStatus(500)
    }
  }
])
app.use('/api/v1/s3/delete/:keyId', [
  async (_req: Request, _res: Response) => {
    try {
      const client = new S3Client({
        region: process.env.REGION,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY ?? '',
          secretAccessKey: process.env.SECRET_ACCESS_KEY ?? ''
        }
      })

      const keyId = _req.params.keyId

      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.BUCKET,
          Key: keyId
        })
      )
      // will delete normal if not exist
      return _res.sendStatus(204)
    } catch {
      return _res.sendStatus(500)
    }
  }
])

app.listen(process.env.PORT, () => {
  console.log('Server is running on...')
})
