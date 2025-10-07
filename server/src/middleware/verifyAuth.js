import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env.js'

const verifyJwt = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        msg: 'Token not found'
      })
    }
    //should throw error if invalid, expired etc
    const tokenObj = jwt.verify(token, JWT_SECRET)
    req.body.tokenObj = tokenObj
    next()
  }
  catch (error) {
    return res.status(500).json({
      msg: 'Error verifying JWT, token might be expired'
    })
  }
}

export {
  verifyJwt
}
