const Router = require('express')
const router = new Router()
const watchedController = require('../controllers/watchedController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware, watchedController.getOne)

module.exports = router