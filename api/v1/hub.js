const router = require('express').Router()
const JSONResponse = require('../../lib/json.helper')
const usersController = require('./controllers/users.controller')
const itemsController = require('./controllers/items.controller')
const servicesController = require('./controllers/services.controller')
const adminsController = require('./controllers/admins.controller')
const contactsController = require('./controllers/contacts.controller')
const workersController = require('./controllers/workers.controller')
const typeCheck = require('./middleware/typeCheck.middleware')
const categoryModel = require('../../lib/db/models/category.model')

router.get('', (req, res) => {
	let concat = []
	for (let layer of router.stack) {
		concat.push({
			path: layer.route.path,
			methods: Object.keys(layer.route.methods),
		})
	}
	const descriptions = [
		`API DOCS URL`,
		`Server-up check.`,
		`Route for managing logins, session resumptions, user profile updates and deleting profile.`,
		`Activates a newly registered user.`,
		`Registers a new user.`,
		`Administrative management of users via IDs.`,
		`Route for managing logins and session resumption for admins.`,
		`Route for collecting all items or creating an item.`,
		`Route for updating or deleting an item.`,
		`Route for collecting all services or creating a service.`,
		`Route for updating or deleting a service.`,
		`Route for collecting all workers or creating a worker.`,
		`Route for updating or deleting a worker.`,
		`Route for creating a contact of getting all contacts.`,
		`Route for updating or soft deleting a contact.`,
		`Get all item categories.`,
		`Get all workers.`,
	]
	let body = {
		name: 'Trinity Plumbing API v1',
		version: '1.0.0',
		routes: concat,
		description: descriptions,
	}
	res.render('summary', body)
})

router.all('', (req, res) => {
	let body = {
		name: 'Trinity Plumbing API',
		version: '1.2.8',
	}
	res.json(body)
})

router
	.route('/users')
	.post(usersController.signIn)
	.all(typeCheck(['user']))
	.get(usersController.session)
	.patch(usersController.updateUser)
	.delete(usersController.destroyUser)
router.route('/users/register/:id').get(usersController.verifyUser)
router.route('/users/register').post(usersController.signUp)
router
	.route('/users/:id')
	.all(typeCheck(['admin']))
	.get(usersController.getAny)
	.patch(usersController.updateUserAny)
	.delete(usersController.destroyUserAny)

router
	.route('/admins')
	.all(typeCheck(['admin']))
	.post(adminsController.signIn)
	.get(adminsController.session)

router
	.route('/items')
	.get(itemsController.get)
	.all(typeCheck(['admin']))
	.post(itemsController.add)
router
	.route('/items/:id')
	.all(typeCheck(['admin']))
	.patch(itemsController.update)
	.delete(itemsController.destroy)

router
	.route('/services')
	.get(servicesController.get)
	.all(typeCheck(['admin']))
	.post(servicesController.add)
router
	.route('/services/:id')
	.all(typeCheck(['admin']))
	.patch(servicesController.update)
	.delete(servicesController.destroy)

router
	.route('/workers')
	.all(typeCheck(['admin']))
	.get(workersController.get)
	.post(workersController.add)
router
	.route('/workers/:id')
	.all(typeCheck(['admin']))
	.patch(workersController.update)
	.delete(workersController.destroy)

router
	.route('/contacts')
	.post(contactsController.add)
	.all(typeCheck(['admin']))
	.get(contactsController.get)
router
	.route('/contacts/:id')
	.all(typeCheck(['admin']))
	.patch(contactsController.correspondence)
	.delete(contactsController.delete)

router.route('/categories').get(async (req, res) => {
	const list = await categoryModel.find().catch((err) => {
		JSONResponse.error(req, res, 500, 'Database Error', err)
	})
	if (list.length > 0)
		JSONResponse.success(req, res, 200, 'Collected matching documents', list)
	else
		JSONResponse.error(req, res, 404, 'Could not find any matching documents')
})

module.exports = router
