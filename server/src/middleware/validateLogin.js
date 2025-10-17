import bcrypt from 'bcrypt'
import { User } from '../models/models.js'

const validateLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        msg: 'bad request, please check email and password fields'
      })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ 
        msg: `User ${email} does not exist` })
    }
    const pwdMatch = await bcrypt.compare(password, user.password)
    if (!pwdMatch) {
      return res.status(400).json({
        msg: 'Invalid credentials'
      })
    }
    //add user for next function
    req.body.user = user
    next()
  }
  catch (error) {
    res.status(500).json({
      msg: `Error in validate login: ${error.message}`
    })
  }
}

export {
  validateLogin
}
