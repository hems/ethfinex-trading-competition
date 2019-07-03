startup = async () => {

  // connect to mongodb
  const mongodb = require('./lib/mongodb/connect')
  await mongodb(process.env.MONGODB_URI)

  // setup webserver
  const express = require('express')
  const path = require('path')

  const PORT = process.env.PORT || 5000

  const yesterday = require('./routes/api/v1/yesterday')
  const byDate = require('./routes/api/v1/byDate')
  const results = require('./routes/api/v1/results')
  const resultsByToken = require('./routes/api/v1/resultsByToken')

  express()
    .get('/api/v1/results', results )
    .get('/api/v1/resultsByToken/:token', resultsByToken )
    .get('/api/v1/yesterday', yesterday )
    .get('/api/v1/date/:year/:month/:day', byDate )

    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  // schedules every day job
  const job = require('./everyDayJob.js')
  job()

  // cache previous days
  const cache = require('./cachePreviousDays')
  cache()

}

startup()
