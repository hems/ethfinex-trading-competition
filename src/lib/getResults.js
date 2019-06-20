/**
 *
 * Compute resulsts for all records on the database ( regardless of the date )
 * and rank them by USD amount
 */
const collection = require('../lib/mongodb/collection')
const BigNumber = require('bignumber.js')
const _ = require('lodash')

module.exports = async () => {
  Stats = collection('stats')

  const docs = await Stats.find({}).toArray()

  const results = {}

  for(doc of docs){

    for(address in doc.volume){

      results[address] = results[address] || new BigNumber(0)

      results[address] = results[address].plus(doc.volume[address].totalUsd)
      //console.log("address ->", address)
    }
  }

  const ranking = []

  for(address in results){

    ranking.push({
      address: address,
      amount : results[address].toNumber()
    })

  }

  const orderedRanking = _.orderBy(ranking, 'amount').reverse()

  return orderedRanking
}
