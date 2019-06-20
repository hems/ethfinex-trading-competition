const getResultsByToken = require('../../../lib/getResultsByToken')

module.exports = async (req, res) => {

  const token = String(req.params.token) || 'ETH'

  const result = await getResultsByToken(token)

  res.setHeader('Content-Type', 'application/json');
  res.send(result)
}
