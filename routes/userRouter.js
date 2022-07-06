const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/checkPswrd',authMiddleware, UserController.checkPswrd)
router.get('/auth',authMiddleware, UserController.check)
router.get('/getOne',authMiddleware, UserController.getOneUser)
router.put('/change', authMiddleware, UserController.update)



module.exports = router