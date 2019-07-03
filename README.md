<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# EFX Trustless Competition

  This API provides the volume ranking of wallet addresses trading on https://trustless.ethfinex.com

# Example endpoints

  - Display volume of for 13/06/2019 for all tokens traded and respective USD values: [/api/v1/date/2019/06/13](http://competition.nectar.community/api/v1/date/2019/06/13)

  - Display volume ranking ( in ether ) for ethereum trades since 13/06/1028 - [api/v1/resultsByToken/eth](http://competition.nectar.community/api/v1/resultsByToken/eth)

  - Display USD volume for all tokens summed ( in usd ) since 13/06/1028 - [api/v1/results](http://competition.nectar.community/api/v1/results)

## Developing

1. `npm run develop`

Note: you should update .env file with your own INFURA web3 provider address

### You can also deploy your own version to heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

