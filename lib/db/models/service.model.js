const db = require('../db.js')

let serviceSchema = new db.Schema({
	name: {
		type: String,
		unique: [true, 'Such a service already exists'],
		required: [true, 'No name provided'],
	},
	description: {
		type: String,
		required: [true, 'No description provided'],
	},
	imageUrl: {
		type: String,
		required: [true, 'No image url provided'],
	},
	price: {
		type: Number,
		required: [true, 'No price provided'],
	},
})

serviceSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await db
			.model('services')
			.find({ name: this.name })
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

const serviceModel = db.model('services', serviceSchema)
module.exports = serviceModel
