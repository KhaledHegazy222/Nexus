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

app.listen(process.env.PORT, () => {
  console.log('Server is running on...')
})
