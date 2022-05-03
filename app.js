const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')
const api  = require('./api')

dotenv.config({
	path: path.join(__dirname, 'config.env')
})

const getData = async () => {
	const prefValue = process.argv[2]
	const walletAddress = process.argv[3]

	if(prefValue === '--wallet') {
		if(walletAddress && walletAddress.length === 42) {
			const balance = await api.getBalance(walletAddress)
			const transactions = await api.getTransaction(walletAddress)
			const positions = await api.getPosition()

			return {
				balance: balance,
				transactions: transactions,
				positions: positions
			}
		}
		else {
			throw Error('Incorrect Wallet Address')
		}
	}
	else {
		throw Error('Please provide wallet address')
	}
}

const procRun = async () => {
	const displayData = await getData()
	console.log('-----Wallet balance, transactions and positions-----\n', JSON.stringify(displayData, null, 4))
	fs.writeFileSync('store.json', JSON.stringify(displayData, null, 4))
}

procRun()