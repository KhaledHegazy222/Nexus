import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { type Request, type Response } from 'express'
import express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const accountRoute = require('./route/accountRoute')
const courseRoute = require('./route/courseRoute')

const app = express()

app.use(cors())
// parse application/json parser
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1', accountRoute)
app.use('/api/v1/course', courseRoute)

// temp
const s3 = require('./s3Client')
app.use('/api/v1/s3/list', [
  async (_req: Request, _res: Response) => {
    try {
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
          await s3.client.send(command)
        if (Contents == null) break
        const contentsList: string = Contents.map(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          (c: any) => ` • ${c.Key}`
        ).join('\n')
        contents += contentsList + '\n'
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

app.listen(process.env.PORT, () => {
  console.log('Server is running on...')
})
