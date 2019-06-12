/* eslint-env mocha */
const {assert} = require('chai')

const getConfig = require('../src/config.js')
const getBlockByTime = require('../src/lib/getBlockByTime')
const getDailyVolume = require('../src/lib/getDailyVolume')
const getBlockRangeForDay = require('../src/lib/getBlockRangeForDay')
const getDailyVolumeUsingFill = require('../src/lib/getDailyVolumeUsingFill')
const getResults = require('../src/lib/getResults')
const moment = require('moment')

describe('~ efx-trustless-competition', async () => {

  it('connects to mongodb', async () => {
    // connect to mongodb
    const mongodb = require('../src/lib/mongodb/connect')
    await mongodb(process.env.MONGODB_URI)
  })

  /**

  it('config is being fetched from ethfinex api', async () => {
    const config = await getConfig()

    // assert tokenRegistry contains tokens
    assert.ok(Object.keys(config.tokenRegistry))

    // TODO: test more conditions to validate if config is being fetched
    // correctly
  })

  it('get block range for a given data', async() => {
    const currentDay = moment().utc().date()
    const currentMonth = moment().utc().month()
    const currentYear = moment().utc().year()

    const startOfYesterday = moment.utc()
      .year(currentYear)
      .month(currentMonth)
      .date(currentDay-1)
      .hours(0)
      .minutes(0)
      .seconds(0)

    const range = await getBlockRangeForDay(startOfYesterday.unix())

    assert.equal(range.fromBlock.number, 7934249)
    assert.equal(range.toBlock.number  , 7940638)

  })

  it('get yesterday logs', async () => {
    const currentDay = moment().utc().date()
    const currentMonth = moment().utc().month()
    const currentYear = moment().utc().year()

    const startOfYesterday = moment.utc()
      .year(currentYear)
      .month(currentMonth)
      .date(currentDay-1)
      .hours(0)
      .minutes(0)
      .seconds(0)

    const range = {
      fromBlock: { // 2019-06-11T00:00:00Z
        number: 7934249,
        timestamp: 1560211219
      },
      toBlock: { // 2019-06-11T23:59:50Z
        number: 7940638,
        timestamp: 1560297590
      }
    }

    const result = await getDailyVolumeUsingFill(range,startOfYesterday.unix())

  })
  **/

  it('get results', async () => {

    const result = await getResults()


  })

})
