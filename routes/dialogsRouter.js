const Router = require('express')
const router = new Router()
const dialogController = require("../controllers/dialogsController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, dialogController.create);
router.get('/', authMiddleware,dialogController.getAll);
router.delete('/', checkRoleMiddleware("ADMIN"), dialogController.destroy)

module.exports = router