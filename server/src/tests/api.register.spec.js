import { test, it, expect } from 'vitest'
import axios from 'axios'
import { BACKEND_URL } from '../env.js'

const payloadCreateNonAdmin = {
    email: 'useruser@gmail.com',
    password: '1234',
    organization: 'Babadoo Inc'
}

const payloadCreateAdmin = {
  email: 'userAdmin@gmail.com',
  password: '1234',
  organization: 'Babadoo Inc',
  isAdmin: true
}

it('creates non admin user', () => {
  let data;
  let status;
  axios.post(
      BACKEND_URL + '/users/register',
      payloadCreateNonAdmin
    )
    .then(res => {
      data = res.data,
      status = res.status
    })
    .catch(err => {
    })
    .finally(() => {
      expect(status).toBe(200)
      expect(data).toHaveProperty('id')
      //TODO check if user exists
      //TODO delete created user
    })
})

//it('creates admin user', () => {
//  let data;
//  let status;
//  axios.post(
//      BACKEND_URL + '/users/register',
//      payloadCreateAdmin
//    )
//    .then(res => {
//      data = res.data,
//      status = res.status
//    })
//    .catch(err => {
//    })
//    .finally(() => {
//      expect(status).toBe(200)
//      expect(data).toHaveProperty('id')
//      //TODO check if user exists
//      //TODO delete created user
//    })
//})
