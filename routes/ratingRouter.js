const Router = require('express')
const router = new Router()
const ratingController = require("../controllers/ratingController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, ratingController.create)
router.get('/:id', ratingController.getOne)
router.get('/', ratingController.getAll)
router.put('/',checkRoleMiddleware("ADMIN"), ratingController.update)
router.delete('/:id',checkRoleMiddleware("ADMIN"), ratingController.delete)



module.exports = router