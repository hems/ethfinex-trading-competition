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

    const makerAssetData = assetDataUtils.decodeERC20AssetData(log.args.makerAssetData)
    const makerToken = config.tokenMap[makerAssetData.tokenAddress]

    tokensSet.add(makerToken)
    tokensSet.add(takerToken)

    const takerAddress = log.args.takerAddress
    const takerAmount  = new BigNumber(log.args.takerAssetFilledAmount)
      .shiftedBy(-1 * config.tokenRegistry[takerToken].decimals)

    const makerAddress = log.args.makerAddress
    const makerAmount  = new BigNumber(log.args.makerAssetFilledAmount)
      .shiftedBy(-1 * config.tokenRegistry[makerToken].decimals)

    // takerAddress is always ethfinex

    volume[makerAddress] = volume[makerAddress] || {}
    volume[makerAddress][makerToken] = volume[makerAddress][makerToken] || new BigNumber(0)

    volume[makerAddress][makerToken] = volume[makerAddress][makerToken].plus(makerAmount)

    volume[makerAddress] = volume[makerAddress] || {}
    volume[makerAddress][takerToken] = volume[makerAddress][takerToken] || new BigNumber(0)

    volume[makerAddress][takerToken] = volume[makerAddress][takerToken].plus(takerAmount)


    //console.log("---")

    //console.log("maker         ->", makerAddress)
    //console.log("maker token   ->", makerToken)
    //console.log("maker amount  ->", makerAmount.toPrecision())

    //console.log("")

    //console.log("taker         ->", takerAddress)
    //console.log("taker token   ->", takerToken)
    //console.log("taker amount  ->", takerAmount.toPrecision())

    //
    //break
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
