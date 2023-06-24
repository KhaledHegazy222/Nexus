import express = require('express')
import { type Request, type Response } from 'express'
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(cors())
// parse application/json parser
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/v1/', (_req: Request, res: Response) => {
  return res.send('hello world')
})

app.listen(process.env.PORT, () => {
  console.log('Server is running on...')
})
