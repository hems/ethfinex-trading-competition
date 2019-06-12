const getResults = require('../../../lib/getResults')

module.exports = async (req, res) => {
  const result = await getResults()

  res.setHeader('Content-Type', 'application/json');
  res.send(result)
}
