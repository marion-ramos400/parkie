import { describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import { MONGODB_URI, DB_NAME, BACKEND_URL } from '../env.js'
import { mongoose } from 'mongoose'
import { User } from '../models/user.models.js'
import axios from 'axios'

const payload = {
  createNonAdmin: {
    email: 'useruser@gmail.com',
    password: '1234',
    organization: 'Babadoo Inc'
  },
  createAdmin: {
    email: 'userAdmin@gmail.com',
    password: '1234',
    organization: 'Babadoo Inc',
    isAdmin: true
  }
}

const deleteTestUsers = async () => {
  await mongoose.connect(
    MONGODB_URI, 
    { dbName: DB_NAME }
  )
  await User.deleteOne({ email: payload.createNonAdmin.email })
  await User.deleteOne({ email: payload.createAdmin.email })
}

describe('calls /users/create endpoint', () => {
  afterEach(async () => {
    await deleteTestUsers()
  })
  it('creates non admin user through api', async () => {
    let data;
    let status;
    await axios.post(
      BACKEND_URL + '/users/create',
      payload.createNonAdmin
      )
      .then(res => {
        console.log(res.data)
        data = res.data
        status = res.status
      })
      .catch(err => {
        console.error(err.message)
      })
      .finally(() => {
        expect(status).toBe(201)
        expect(data).toHaveProperty('user')
      })
  })
})

