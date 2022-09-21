const contactModel = require('../../../lib/db/models/contact.model')
const workerModel = require('../../../lib/db/models/worker.model')
const JSONResponse = require('../../../lib/json.helper')
const JWTHelper = require('../../../lib/jwt.helper')

class contactsController {
	//Read
	static async get(req, res) {
		const list = await contactModel.find().catch((err) => {
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
		const deco = JWTHelper.getToken(req, res, 'jwt_auth')
		body._user = deco.self
		let newdoc = new contactModel(body)
		let dupe = await newdoc.checkDupe()
		if (dupe) {
			JSONResponse.error(req, res, 409, 'Duplicate document')
		} else {
			const invalid = await newdoc.validate().catch((err) => {
				invalid = true
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

	static async correspondence(req, res) {
		const id = req.params.id
		const wid = req.params.did
		const newdoc = await contactModel.findById(id).catch((err) => {
			JSONResponse.error(req, res, 500, 'Database Error', err)
		})
		const worker = await workerModel.findById(wid).catch((err) => {
			JSONResponse.error(req, res, 500, 'Database Error', err)
		})
		if (newdoc) {
			newdoc.correspondence(worker)
			JSONResponse.success(req, res, 'Email sent')
		}
	}

	//Delete
	static async delete(req, res) {
		let id = req.params.id
		const olddoc = await contactModel
			.findByIdAndUpdate(id, { active: false })
			.catch((err) => {
				JSONResponse.error(req, res, 500, 'Database Error', err)
			})

		if (olddoc) {
			JSONResponse.success(req, res, 200, 'Successfully removed document')
		} else {
			JSONResponse.error(req, res, 404, 'Could not find document')
		}
	}
}

module.exports = contactsController
