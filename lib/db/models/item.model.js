const db = require('../db.js')

let itemSchema = new db.Schema({
	name: {
		type: String,
		unique: [true, 'Such an item already exists'],
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
	stock: {
		type: Number,
		default: 100,
	},
})

itemSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await db
			.model('items')
			.find({ name: this.name })
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

const itemModel = db.model('items', itemSchema)
module.exports = itemModel
