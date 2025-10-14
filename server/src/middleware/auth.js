import jwt from 'jsonwebtoken'
import * as env from '../env.js'
import { User } from '../models/user.models.js'
import Cookies from '../http/cookies.js'
import Send from '../http/response.js'

class Auth {
  static async verifyJwt(req, res, next) {
    try {
      const token = req.cookies.accessToken
      if (!token) {
        return Send.unAuthorized(res, null, 'Token not found')
      }
      //should throw error if invalid, expired etc
      const tokenObj = jwt.verify(token, env.JWT_SECRET)
      if (!req.body) { //for get req
        req.body = { tokenObj }
      }
      else { // for post req
        req.body.tokenObj = tokenObj
      }
      next()
    }
    catch (error) {
      Send.error(res, null, 'Error verifying JWT, token might be expired')
    }
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken
      //check if token in db
      const user = await User.findOne({ refreshToken })
      if (!user) {
        return Send.unAuthorized(res, null, 'Error refresh token not found')
      }
      
      if (user.refreshToken !== refreshToken) {
        //token should be gone when logged out
        return Send.unAuthorized(res, null, 'Invalid refresh token')
      }

      try {
        const refTokenObj = jwt.verify(refreshToken, env.REFRESH_SECRET)
      }
      catch (error) {
        return Send.unAuthorized(res, null, 'Token expired')
      }

      const newAccessToken = jwt.sign(
        { 
          email: user.email, 
          id: user._id,
          dt: Date.now()
        }, 
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE }
      )
      Cookies.set(res, "accessToken", newAccessToken, env.JWT_MAX_AGE)
      Send.created(
        res, 
        { token: newAccessToken }, 
        "Access token refreshed")
    }
    catch (error) {
      Send.error(res,
        null,
        `Error verifying refresh token: ${error.message}`)
    
    }
  }
}

export default Auth
