const workerModel = require('../../../lib/db/models/worker.model')
const JSONResponse = require('../../../lib/json.helper')

class workersController {
	//Read
	static async get(req, res) {
		const list = await workerModel.find().catch((err) => {
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
		else
			JSONResponse.error(
				req,
				res,
				404,
				'Could not find any matching documents'
			)
	}

	//Create
	static async add(req, res) {
		let body = req.body
		let newdoc = new workerModel(body)
		let dupe = await newdoc.checkDupe()
		if (dupe) {
			JSONResponse.error(req, res, 409, 'Duplicate document')
		} else {
			const valid = await newdoc.validate().catch((err) => {
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
			if (valid) {
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
		const olddoc = await workerModel.findByIdAndDelete(id).catch((err) => {
			JSONResponse.error(req, res, 500, 'Database Error', err)
		})

		if (olddoc) {
			JSONResponse.success(req, res, 200, 'Successfully removed document')
		} else {
			JSONResponse.error(req, res, 404, 'Could not find document')
		}
	}

	//Delete
	static async update(req, res) {
		let id = req.params.id
		let body = req.body
		const newdoc = await workerModel
			.findByIdAndUpdate(id, body)
			.catch((err) => {
				JSONResponse.error(req, res, 500, 'FDatabase Error', err)
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

module.exports = workersController