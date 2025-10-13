import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import { JWT_SECRET, JWT_EXPIRE, REFRESH_SECRET, REFRESH_EXPIRE } from '../env.js'

const createUser = async (req, res) => {
  const { email, password, isAdmin} = req.body
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ 
        msg: `User Email ${email} already exists`
      })
    }
    const newUser = await User.create({
      email,
      password,
      isAdmin: isAdmin ? isAdmin : false
    })
    const adminStr = isAdmin ? 'Admin ' : ''
    res.status(201).json({
      msg: `${adminStr}User created successfully`,
      user: {
        id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      }
    })
  }
  catch (error) {
    res.status(500).json({
      msg: `ERROR: ${error}`
    })
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
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    )
    const refreshToken = jwt.sign(
      tokenData, 
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRE }
    )
    await User.updateOne({ email: user.email }, { refreshToken })
    res.cookie("accessToken", jwtoken, {
      httpOnly: true,
      secure: true, //TODO set to true for production
      maxAge: 15 * 60 * 1000,//TODO parse this from JWT_EXPIRE: 15min
      sameSite: "None",
      partitioned: true,
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, //TODO set to true for production
      maxAge: 12 * 60 * 60 * 1000,//TODO parse this from REFRESH_EXPIRE: 12h
      sameSite: "None",
      partitioned: true,
    })

    res.status(200).json({
      message: 'login successful',
      token: jwtoken,
      refreshToken: refreshToken
    })
  }
  catch (error) {
    res.status(500).json({
      msg: `Error log in user: ${error.message}`
    })
  }
}

const logOutUser = async (req, res) => {
  try {
    const tokenObj = jwt.verify(req.cookies.refreshToken, REFRESH_SECRET)
    await User.updateOne({ _id: tokenObj.id }, { refreshToken: '' })
    res.clearCookie('accessToken', { partitioned: true })
    res.clearCookie('refreshToken', { partitioned: true })
    return res.status(200).json({
      msg: 'User logged out'
    })
  }
  catch (error) {
    res.status(500).json({
      msg: 'logout error verifying refresh token'
    })
  }
}


const deleteUser = async (req, res) => {
  const { email } = req.body
  try {
    const deleteUser = await User.deleteOne({ email })
    if (deleteUser.deletedCount < 1) {
      res.status(404).json({
        msg: `user email: ${email} not found`
      })
    }
    else {
      res.status(200).json({
        msg: `user ${email} deleted`
      })
    }
  }
  catch (error) {
    res.status(500).json({
      msg: `ERROR: ${error}`
    })
  }
}

const validateUser = async (req, res) => {
  const { email, id } = req.body.tokenObj
  const user = await User.findOne({ email })
  if (!user) {
    res.status(404).json({
      msg: `User not found`
    })
  }
  res.status(200).json({
    msg: 'User validated'
  })
}

const getUser = async (req, res) => {
  const { email, id } = req.body.tokenObj
  const user = await User.findOne({ email })
  if (!user) {
    res.status(404).json({
      msg: `User not found`
    })
  }
  res.status(200).json({
    email: user.email,
    bookings: user.bookings,
    msg: 'User found'
  })
}

export {
  createUser,
  logInUser,
  logOutUser,
  deleteUser,
  validateUser,
  getUser,
}
