const Router = require('express')
const router = new Router()
const deviceController = require("../controllers/deviceController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")

router.post('/', checkRoleMiddleware("ADMIN"), deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.put('/', checkRoleMiddleware("ADMIN"), deviceController.update);
router.delete('/', checkRoleMiddleware("ADMIN"), deviceController.deleteDevice)



module.exports = router