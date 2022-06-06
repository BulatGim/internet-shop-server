const Router = require('express')
const router = new Router()
const typeController = require("../controllers/TypeController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")

router.post('/', checkRoleMiddleware("ADMIN"), typeController.create);
router.get('/', typeController.getAll);



module.exports = router