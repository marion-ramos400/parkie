import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env.js'
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import { verifyJwt, refreshToken } from '../middleware/verifyAuth.js'
import { createUser, logInUser, validateUser } from '../controllers/user.controller.js'

const router = express.Router()
router.post('/login', validateLogin, logInUser)
router.post('/create', hashPassword, createUser)
router.post('/verify', verifyJwt, validateUser)
router.post('/refresh', refreshToken)

export default router
