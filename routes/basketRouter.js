const Router = require('express')
const router = new Router()
const BasketDeviceController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, BasketDeviceController.addToBasket)
router.get('/',authMiddleware, BasketDeviceController.getAll)
router.delete('/:id',authMiddleware, BasketDeviceController.deleteOne)
router.delete('/',authMiddleware, BasketDeviceController.deleteAll)



module.exports = router