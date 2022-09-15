const db = require('../db.js')

let workerSchema = new db.Schema({
	name: { type: String, required: [true, 'No name provided'] },
	email: { type: String, required: [true, 'No email provided'] },
})

const workerModel = db.model('workers', workerSchema)
module.exports = workerModel
