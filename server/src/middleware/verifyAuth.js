import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRE, REFRESH_SECRET, REFRESH_EXPIRE } from '../env.js'
import { User } from '../models/user.models.js'

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

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    //check if token in db
    const user = await User.findOne({ refreshToken })
    if (!user) {
      return res.status(401).json({
        msg: `Error refresh token not found`
      })
    }
    
    if (user.refreshToken !== refreshToken) {
      //token should be gone hen logged out
      return res.status(401).json({
        msg: `Invalid refresh token`
      })
    }

    try {
      const refTokenObj = jwt.verify(refreshToken, REFRESH_SECRET)
    }
    catch (error) {
      return res.status(401).json({
        msg: "Token expired"
      })
    }

    const newAccessToken = jwt.sign(
      { 
        email: user.email, 
        id: user._id,
        dt: Date.now()
      }, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    )
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, //TODO set to true for production
      maxAge: 15 * 60 * 1000,//TODO parse this from JWT_EXPIRE: 15min
      sameSite: "strict"
    })
    return res.status(201).json({
      msg: "Access token refreshed",
      token: newAccessToken
    })
  }
  catch (error) {
    return res.status(500).json({
      msg: `Error verifying refresh token: ${error.message}`
    })
  
  }
}

export {
  verifyJwt,
  refreshToken,
}
