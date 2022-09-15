const { sendMail } = require('../../email.helper.js')
const db = require('../db.js')

let contactSchema = new db.Schema({
	_user: {
		type: db.Types.ObjectId,
		required: [true, 'No user provided'],
		ref: 'users',
	},
	_service: {
		type: db.Types.ObjectId,
		required: [true, 'No service provided'],
		ref: 'services',
	},
	address: {
		type: String,
		required: [true, 'No address provided'],
	},
	active: {
		type: Boolean,
		default: false,
		required: [true, 'No activity state provided'],
	},
})

contactSchema.methods.checkDupe = function () {
	return new Promise(async (resolve, reject) => {
		const dupe = await db
			.model('contacts')
			.find({ name: this.name })
			.catch((err) => {
				reject(err)
			})
		resolve(dupe.length > 0)
	})
}

contactSchema.methods.correspond = function (worker) {
	this.populate(['user', 'service'])
	sendMail(
		worker.email,
		'Client Request',
		`Greetings ${worker.name},\n
    Your services are required by ${this._user.name} at ${this._user.address} for ${this._service.name}.`
	)
	// return new Promise(async (resolve, reject) => {
	// 	const dupe = await db
	// 		.model('contacts')
	// 		.find({ name: this.name })
	// 		.catch((err) => {
	// 			reject(err)
	// 		})
	// 	resolve(dupe.length > 0)
	// })
}

const contactModel = db.model('contacts', contactSchema)
module.exports = contactModel
