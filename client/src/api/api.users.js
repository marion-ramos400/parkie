import axios from 'axios'
import { apiPost } from './api.utils.js'
import { VITE_PARKIE_SERVER } from '../env.js'

const instance = axios.create({
  baseURL: VITE_PARKIE_SERVER + '/users'
})
instance.defaults.withCredentials = true

const apiLoginUser = async (email, password) => {
  return await apiPost(
    instance,
    '/login',
    { email, password },
    'apiLoginUser'
  )
}

const apiVerifyJwt = async () => {
  return await apiPost(
    instance,
    '/verify',
    {},
    'apiVerifyJwt'
  )
}

const apiRefreshUser = async () => {
  return await apiPost(
    instance,
    '/refresh',
    {},
    'apiRefreshUser'
  )
}

const apiLogOutUser = async () => {
  return await apiPost(
    instance,
    '/logout',
    {},
    'apiLogOutUser'
  )
}

export {
  apiLoginUser,
  apiVerifyJwt,
  apiRefreshUser,
  apiLogOutUser
}
