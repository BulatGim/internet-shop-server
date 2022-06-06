const Router = require('express')
const router = new Router()
const BasketDeviceController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, BasketDeviceController.addToBasket)
router.get('/',authMiddleware, BasketDeviceController.getAll)
router.delete('/',authMiddleware, BasketDeviceController.delete)



module.exports = router