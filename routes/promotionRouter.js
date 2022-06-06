const Router = require('express')
const router = new Router()
const promotionController = require('../controllers/promotionController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, promotionController.create)
router.get('/', promotionController.getAll)
router.put('/', authMiddleware, promotionController.put)
router.delete('/', authMiddleware, promotionController.delete)



module.exports = router