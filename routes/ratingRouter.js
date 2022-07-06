const Router = require('express')
const router = new Router()
const ratingController = require("../controllers/ratingController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, ratingController.create)
router.get('/:id', ratingController.getOne)
router.get('/', ratingController.getAll)
router.get('/user/:id', ratingController.getReviewsMadeByUser)
router.get('/devices/:id', ratingController.getInOneDevice)
router.put('/',checkRoleMiddleware("ADMIN"), ratingController.update)
router.delete('/:id',checkRoleMiddleware("ADMIN"), ratingController.delete)



module.exports = router