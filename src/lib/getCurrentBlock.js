/**
 * Sometimes infura returns null for the current block, in this case we need
 * to retry until we get the block as the application completely depends
 * on this information.
 *
 * See: https://github.com/INFURA/infura/issues/43
 *
 */
const sleep = require('sleep-promise')

module.exports = async (web3) =>{

  let block = null

  while(block == null){
    const currentBlockNumber = await web3.eth.getBlockNumber()

    block = await web3.eth.getBlock(currentBlockNumber)

    if(!block) {
      await sleep(2000)
    }
  }

  return block
}
