import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env.js'
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import { createUser, logInUser } from '../controllers/user.controller.js'

const router = express.Router()
router.post('/login', validateLogin, logInUser)
router.post('/create', hashPassword, createUser)

export default router
