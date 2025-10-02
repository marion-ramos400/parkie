import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env.js'
const router = express.Router()
router.post('/login', (req, res) => {
  //TODO add validation for empty fields
  //TODO check if already logged-in
  const jwtoken = jwt.sign(
    req.body, 
    JWT_SECRET,
    { "expiresIn": "10m"}
  )
//  const username = req.body.username
//  const password = req.body.password
  res.status(200).json(
    {
      token: jwtoken
    }
  )
})

export default router
