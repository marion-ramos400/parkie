import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../models/user.models.js'
import { connectDB } from '../db/utils.js'

await connectDB()
const hashedPwd = await bcrypt.hash('password', 10)

const newUser = await User.create({
  email: 'testUser@bbmail.com',
  password: hashedPwd,
})
