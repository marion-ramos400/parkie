import express from 'express'
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import Auth from '../middleware/auth.js'
import { UserController } from '../controllers/controllers.js'

const userControl = new UserController()
const router = express.Router()
router.post('/login', validateLogin, userControl.login)
router.post('/create', hashPassword, userControl.create)
router.post('/verify', Auth.verifyJwt, userControl.validate)
router.post('/refresh', Auth.refreshToken)
router.post('/logout', userControl.logout)

router.get('/get', Auth.verifyJwt, userControl.get)

export default router
