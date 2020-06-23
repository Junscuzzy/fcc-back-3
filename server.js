'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const helmet = require('helmet')

const apiRoutes = require('./routes/api.js')
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')

require('dotenv').config()

const app = express()

const port = process.env.PORT || 3000

app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({ origin: '*' })) // USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

// Index page (static HTML)
app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
})

const pass = encodeURI(process.env.MONGO_PASS)
const MONGO_URI = `mongodb+srv://zzfcc:${pass}@fcc-mongodb-71tms.mongodb.net/test?retryWrites=true&w=majority`

MongoClient.connect(MONGO_URI, (err, client) => {
  if (err) {
    console.error('database connection error', err)
    throw err
  } else {
    console.log('Successfull database connection')
  }

  const db = client.db('library')

  // For FCC testing purposes
  fccTestingRoutes(app)

  // Routing for API
  apiRoutes(app, db)

  // 404 Not Found Middleware
  app.use((req, res, next) => {
    res.status(404).type('text').send('Not Found')
  })

  // Start our server and tests!
  app.listen(port, () => {
    console.log('Listening on port ' + port)
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...')
      setTimeout(() => {
        try {
          runner.run()
        } catch (e) {
          const error = e
          console.log('Tests are not valid:')
          console.log(error)
        }
      }, 1500)
    }
  })
})

module.exports = app // for unit/functional testing
