const router = require('express').Router()
const JSONResponse = require('../../lib/json.helper')
const usersController = require('./controllers/users.controller')
const itemsController = require('./controllers/items.controller')
const servicesController = require('./controllers/services.controller')
const adminsController = require('./controllers/admins.controller')
const contactsController = require('./controllers/contacts.controller')
const workersController = require('./controllers/workers.controller')
const typeCheck = require('./middleware/typeCheck.middleware')

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
		`Route for managing logins, session resumptions, user profile updates and logging out.`,
		`Activates a newly registered user..`,
		`Registers a new user or deletes an account.`,
		`Administrative management of users via IDs.`,
		`Route for managing logins and session resumption for admins as well as logging out.`,
		`Route for collecting all items or (admin)creating an item.`,
		`Administrative management of items via IDs.`,
		`Route for collecting all services or (admin)creating a service.`,
		`Administrative management of services via IDs.`,
		`(Admin)Route for collecting all workers or creating a worker.`,
		`Administrative management of workers via IDs.`,
		`(Admin)Route for creating a contact of getting all contact submissions.`,
		`Administrative management of contact submissions via IDs.`,
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
	.delete(logout)
router.route('/users/register/:id').get(usersController.verifyUser)
router
	.route('/users/register')
	.post(usersController.signUp)
	.delete(usersController.destroyUser)
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
	.delete(logout)

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

function logout(req, res) {
	JWTHelper.killToken(req, res, 'jwt_auth')
	JSONResponse.success(req, res, 200, 'Logged out successfully!')
}

module.exports = router
