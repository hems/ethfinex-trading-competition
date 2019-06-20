const moment = require('moment')
const getDailyVolume = require('../getDailyVolumeUsingFill')
const cache = require('../cache/cache')
const getBlockRangeForDay = require('../getBlockRangeForDay')

module.exports = async (timestamp) => {

  // Data range: 13th of September 2018 till yesterday
  const firstDay = moment.utc().year(2019).month(5).date(1)
  const today = moment.utc().startOf('day')

  if(timestamp < firstDay.unix()){
    return { error: 'date_is_too_early' }
  }

  if(timestamp >= today.unix()){
    return { error: 'day_must_be_complete' }
  }

  const query = {timestamp}


  return cache(query, async () => {
    const range = await getBlockRangeForDay(timestamp)

    return getDailyVolume(range, timestamp)
  })

}
