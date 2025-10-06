import bcrypt from 'bcrypt'

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body
    const hashedPwd = await bcrypt.hash(password, 10)
    req.body.password = hashedPwd
    next()
  } catch (error) {
    res.status(500).json({
      msg: `Error in hashing password: ${error.message}`,
    })
  }
}

export { 
  hashPassword
}



