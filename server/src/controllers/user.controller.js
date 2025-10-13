import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import * as env from '../env.js'
import Cookies from '../utils/cookies.js'
import Send from '../utils/response.js'

const createUser = async (req, res) => {
  const { email, password, isAdmin} = req.body
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return Send.badRequest(
        res,
        null,
        `User Email ${email} already exists`
      )
    }
    const newUser = await User.create({
      email,
      password,
      isAdmin: isAdmin ? isAdmin : false
    })
    const adminStr = isAdmin ? 'Admin ' : ''
    const outUser = {
      user: {
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      }
    }
    Send.created(
      res, 
      outUser,
      `${adminStr}User created successfully`,
    )
  }
  catch (error) {
    Send.error(res, null, `error createUser: ${error.message}`)
  }
}

const logInUser = async (req, res) => {
  try {
    const { user } = req.body
    const tokenData = { 
        email: user.email, 
        id: user._id,
        dt: Date.now()

    }
    const jwtoken = jwt.sign(
      tokenData, 
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    )
    const refreshToken = jwt.sign(
      tokenData, 
      env.REFRESH_SECRET,
      { expiresIn: env.REFRESH_EXPIRE }
    )
    await User.updateOne({ email: user.email }, { refreshToken })
    Cookies.set(res, "accessToken", jwtoken, env.JWT_MAX_AGE)
    Cookies.set(res, "refreshToken", refreshToken, env.REFRESH_MAX_AGE)
    
    Send.success(res, null, 'login success')
  }
  catch (error) {
    Send.error(res, null, `Error log in user: ${error.message}`)
  }
}

const logOutUser = async (req, res) => {
  try {
    const tokenObj = jwt.verify(req.cookies.refreshToken, env.REFRESH_SECRET)
    await User.updateOne({ _id: tokenObj.id }, { refreshToken: '' })
    Cookies.clear(res, 'accessToken')
    Cookies.clear(res, 'refreshToken')
    Send.success(res, null, msg='User logged out')
  }
  catch (error) {
    Send.error(res, null, 'logout error verifying refresh token')
  }
}


const deleteUser = async (req, res) => {
  const { email } = req.body
  try {
    const deleteUser = await User.deleteOne({ email })
    if (deleteUser.deletedCount < 1) {
      Send.notFound(res, null, `user email: ${email} not found`)
    }
    else {
      Send.success(res, null, `user ${email} deleted`)
    }
  }
  catch (error) {
    Send.error(res, null, `error deleteUser: ${error.message}`)
  }
}

const validateUser = async (req, res) => {
  const { email, id } = req.body.tokenObj
  const user = await User.findOne({ email })
  if (!user) {
    return Send.notFound(res, null, msg='User not found')
  }
  Send.success(res, null, msg=`User validated`)
}

const getUser = async (req, res) => {
  const { email, id } = req.body.tokenObj
  const user = await User.findOne({ email })
  if (!user) {
    return Send.notFound(res, null, msg='User not found')
  }
  const {refreshToken, ...outProps} = user
  const outUser = {...outProps}
  Send.success(res, 
    outUser,
    msg=`User found`)
}

export {
  createUser,
  logInUser,
  logOutUser,
  deleteUser,
  validateUser,
  getUser,
}
