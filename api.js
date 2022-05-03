const axios = require('axios')
const {ethers} = require('ethers')

const provider = new ethers.providers.EtherscanProvider(
	'ropsten',
	process.env.API_KEY_ETHERSCAN
)

exports.getBalance = async (walletAddress) => {
	try {
		const balance = await provider.getBalance(walletAddress)
		const result = await ethers.utils.formatEther(balance)
		return result
	}
	catch (error) {
		console.log(error)
	}
}

exports.getTransaction = async (walletAddress) => {
	try {
		const history = await provider.getHistory(walletAddress)
		const transactions = history.map(({hash, from, to, value}) => ({
			hash,
			from,
			to,
			value: ethers.utils.formatEther(value)
		}))

		return transactions
	}
	catch (error) {
		console.log(error)
	}
}

exports.getPosition = async (walletAddress) => {
	try {
		const response = await axios({
			method: 'get',
			url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
			headers: {
				'X-CMC_PRO_API_KEY': process.env.API_KEY_COINMARKET
			}
		})

		const positions = response.data.data.filter((item) => {
			return (item.symbol === 'ETH' || (item.platform && item.platform.symbol === 'ETH'))
		}).map((item) => {
			return {
				symbol: item.symbol,
				name: item.name,
				price: `$${item.quote.USD.price}`
			}
		})

		return positions
	}
	catch (error) {
		console.log(error)
	}
}