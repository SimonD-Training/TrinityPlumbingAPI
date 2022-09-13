const mongoose = require('mongoose')

console.log('\n\tEstablishing database connection...')
mongoose.connect(process.env.DBHOST, (err) => {
	if (err) {
		console.log(`\n\tMongoDB failed to connect @ ${process.env.DBHOST}`)
		console.error(err)
		exit(-1)
	} else {
		console.log('\n\tMongoDB succesfully connected...')
	}
})

module.exports = mongoose
