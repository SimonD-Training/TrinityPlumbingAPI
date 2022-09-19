const db = require('../db.js')

let categorySchema = new db.Schema({
	name: { type: String, required: [true, 'Category name blank'] },
})

const categoryModel = db.model('categories', categorySchema)
module.exports = categoryModel
