import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import { JWT_SECRET } from '../env.js'

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
    const jwtoken = jwt.sign(
      { email: user.email, id: user._id }, 
      JWT_SECRET,
      { expiresIn: "2000" }
    )
    res.status(200).json({
      message: 'login successful',
      token: jwtoken
    })
  }
  catch (error) {
    res.status(500).json({
      msg: `Error log in user: ${error.message}`
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

export {
  createUser,
  logInUser,
  deleteUser,
  validateUser
}
