const serviceModel = require('../../../lib/db/models/service.model')
const JSONResponse = require('../../../lib/json.helper')

class servicesController {
	//Read
	static async get(req, res) {
		const list = serviceModel.find().catch((err) => {
			JSONResponse.error(req, res, 500, 'Database Error', err)
		})
		if (list.length > 0)
			JSONResponse.success(
				req,
				res,
				200,
				'Collected matching documents',
				list
			)
		else JSONResponse.error(req, res, 404, 'Could not find any documents')
	}

	//Create
	static async add(req, res) {
		let body = req.body
		let newdoc = new serviceModel(body)
		let dupe = await newdoc.checkDupe()
		if (dupe) {
			JSONResponse.error(req, res, 409, 'Duplicate document')
		} else {
			const invalid = await newdoc.validate().catch((err) => {
				JSONResponse.error(
					req,
					res,
					400,
					err.errors[
						Object.keys(err.errors)[Object.keys(err.errors).length - 1]
					].properties.message,
					err.errors[
						Object.keys(err.errors)[Object.keys(err.errors).length - 1]
					]
				)
			})
			if (!invalid) {
				const newerdoc = await newdoc.save().catch((err) => {
					JSONResponse.error(req, res, 500, 'Database Error', err)
				})
				if (newerdoc)
					JSONResponse.success(
						req,
						res,
						202,
						'Document added successfully',
						newerdoc
					)
			}
		}
	}

	//Delete
	static async destroy(req, res) {
		let id = req.params.id
		const olddoc = await serviceModel.findByIdAndDelete(id).catch((err) => {
			JSONResponse.error(req, res, 500, 'Database Error', err)
		})

		if (olddoc) {
			JSONResponse.success(req, res, 200, 'Successfully removed document')
		} else {
			JSONResponse.error(req, res, 404, 'Could not find document')
		}
	}

	//Update
	static async update(req, res) {
		let id = req.params.id
		let body = req.body
		const newdoc = await serviceModel
			.findByIdAndUpdate(id, body)
			.catch((err) => {
				JSONResponse.error(req, res, 500, 'Database Error', err)
			})
		if (newdoc) {
			JSONResponse.success(
				req,
				res,
				200,
				'Successfully updated document',
				newdoc
			)
		} else {
			JSONResponse.error(req, res, 404, 'Could not find document')
		}
	}
}

module.exports = servicesController
