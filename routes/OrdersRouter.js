const Router = require('express')
const router = new Router()
const OrdersController = require('../controllers/OrdersController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, OrdersController.create)
router.get('/',authMiddleware, OrdersController.getAll)

module.exports = router