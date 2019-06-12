/**
 * Returns the first and last block of the 24 hours
 * fromBlock is the first block that the timestamp is after the given
 * dayTimestamp
 */
const blockByTime = require('./getBlockByTime')

module.exports = async (dayTimestamp) => {
  const fromBlock = await blockByTime(dayTimestamp, dayTimestamp)

  const nextDayTimestamp = dayTimestamp + 24 * 60 * 60

  const toBlock = await blockByTime(nextDayTimestamp, null, nextDayTimestamp)

  const range = {
    fromBlock: fromBlock,
    toBlock: toBlock
  }

  return range
}
