const Router = require('express')
const router = new Router()
const messagesController = require("../controllers/messagesController")
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware")
const authMiddleware = require('../middleware/authMiddleware')

router.post('/:id', authMiddleware, messagesController.create);
router.get('/:id', authMiddleware,messagesController.getDialog);
router.delete('/', authMiddleware, messagesController.destroy)

module.exports = router