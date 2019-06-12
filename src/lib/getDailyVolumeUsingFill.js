const getConfig = require('../config')
const blockByTime = require('./getBlockByTime')
const getPrices = require('./getPrices')
const toDate = require('./timestampToDate')
const { assetDataUtils } = require('@0x/order-utils')
const BigNumber = require('bignumber.js')

module.exports = async (range, dayTimestamp) => {

  // fetches basic app config / info
  const config = await getConfig()

  const fillRange = {
    fromBlock: range.fromBlock.number,
    toBlock  : range.toBlock.number
  }
  // request logs from zeroEx
  const logs = await config.exchangeWrapper.getLogsAsync(
    'Fill',
    fillRange,
    {feeRecipientAddress: config.ethfinexAddress}
  )

  // calculates volume per token
  const volume = {}
  const tokensSet = new Set()

  for(log of logs){
    const takerAssetData = assetDataUtils.decodeERC20AssetData(log.args.takerAssetData)
    const takerToken = config.tokenMap[takerAssetData.tokenAddress]

    console.log("takerToken ->", takerToken)

    const makerAssetData = assetDataUtils.decodeERC20AssetData(log.args.makerAssetData)

    const makerToken = config.tokenMap[makerAssetData.tokenAddress]
    const decimals = config.tokenRegistry[makerToken].decimals

    tokensSet.add(makerToken)

    console.log("makerToken ->", makerToken)

    const takerAddress = log.args.takerAddress
    const takerAmount  = new BigNumber(log.args.takerAssetFilledAmount)
      .shiftedBy(-1 * config.tokenRegistry[makerToken].decimals)

    const makerAddress = log.args.makerAddress
    const makerAmount  = new BigNumber(log.args.makerAssetFilledAmount)
      .shiftedBy(-1 * config.tokenRegistry[makerToken].decimals)

    // takerAddress is always ethfinex
    //volume[takerAddress] = volume[takerAddress] || {}
    //volume[takerAddress][token] = volume[takerAddress][token] || new BigNumber(0)

    volume[makerAddress] = volume[makerAddress] || {}
    volume[makerAddress][makerToken] = volume[makerAddress][makerToken] || new BigNumber(0)

    volume[makerAddress][makerToken] = volume[makerAddress][makerToken].plus(makerAmount)
    //volume[takerAddress][token] = volume[takerAddress][token].plus(takerAmount)


    //console.log("makerAddress ->", makerAddress)
    //console.log("takerAddress ->", takerAddress)

    //console.log("token address ->", makerAssetData.tokenAddress)
    //console.log("token         ->", token)
    //console.log("decimals      ->", decimals )

    //console.log("maker         ->", makerAddress)
    //console.log("maker amount  ->", makerAmount)

    //console.log("taker         ->", takerAddress)
    //console.log("taker amount  ->", takerAmount)
  }

  // transform tokens into array
  const tokens = Array.from(tokensSet)
  const prices = await getPrices(tokens, dayTimestamp)

  //console.log("volume ->", volume)
  //console.log("tokens ->", tokens)
  //console.log("prices ->", prices)

  for(let address in volume){

    // calculate individual token volumes
    for(token in volume[address]){
      let amount = volume[address][token]
      let price  = prices[token]
      let total  = amount.times(price)

      volume[address][token] = {
        usdPrice: price,
        amount  : amount.toNumber(),
        total   : total.toNumber()
      }
    }

    // calculate total volume of all tokens together

    let total = 0

    for(token in volume[address]){
      total += volume[address][token].total
    }

    volume[address].totalUsd = total
  }

  /**
  // shall we also print total daily volume?
  for(var address in volumeByAddress){
    const symbol = config.tokenMap[address]
    const decimals = config.tokenRegistry[symbol].decimals
    const price  = prices[symbol]
    const amount = volumeByAddress[address].times(10 ** (-1 * decimals)).toNumber()

    volume.symbols[symbol] = {
      usdPrice : price,
      amount : amount,
      total : price * amount
    }

    volume.total += volume.symbols[symbol].total
  }
  **/

  return {
    date: toDate(dayTimestamp),

    timestamp: (dayTimestamp),

    volume: volume,

    fromBlock: {
      number: range.fromBlock.number,
      timestamp: range.fromBlock.timestamp,
      date: toDate(range.fromBlock.timestamp)
    },

    toBlock: {
      number: range.toBlock.number,
      timestamp: range.toBlock.timestamp,
      date: toDate(range.toBlock.timestamp)
    }
  }
}
