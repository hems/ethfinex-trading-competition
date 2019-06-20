/**
 *
 * Compute results for a given token volume
 */
const collection = require('../lib/mongodb/collection')
const BigNumber = require('bignumber.js')
const _ = require('lodash')

module.exports = async (token) => {
  token = token.toUpperCase()

  Stats = collection('stats')

  const docs = await Stats.find({}).toArray()

  const dates = []
  const volume = {}

  for(doc of docs){

    dates.push(doc.date)

    for(address in doc.volume){

      // ignore if address didnt trade token
      if(!doc.volume[address][token]) continue

      volume[address] = volume[address] || new BigNumber(0)

      volume[address] = volume[address].plus(doc.volume[address][token].amount)
      //console.log("address ->", address)
    }
  }

  const ranking = []

  for(address in volume){

    ranking.push({
      address: address,
      amount : volume[address].toNumber()
    })

  }

  const orderedRanking = _.orderBy(ranking, 'amount').reverse()

  const result = {
    token: token,
    dates: dates,
    ranking: orderedRanking
  }

  return result
}
