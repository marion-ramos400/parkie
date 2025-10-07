import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  bookings: {
    type: Array,
    required: true,
    default: []
  },
  refreshToken: {
    type: String,
    default: ''
  }
})

const User = mongoose.model('User', userSchema)
export { User }
