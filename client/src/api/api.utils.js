import axios from 'axios'
import { VITE_PARKIE_SERVER } from '../env.js'

const apiPost = async (
  axiosInstance, 
  endpoint, 
  payload,
  apiName
) => {
  let data;
  await axiosInstance.post(
    endpoint, 
    payload) 
    .then(res => {
        if (res.status >= 200 && res.status <= 300) {
          data = res.data
        }
      })
    .catch(err => {
      console.error(`Error ${apiName}: ${err.message}`)
    })
    .finally(() => {
    })
  return data
  }

const apiGet = async (
  axiosInstance, 
  endpoint, 
  apiName
) => {
  let data;
  await axiosInstance.get(
    endpoint, 
    ) 
    .then(res => {
        if (res.status >= 200 && res.status <= 300) {
          data = res.data
        }
      })
    .catch(err => {
      console.error(`Error ${apiName}: ${err.message}`)
    })
    .finally(() => {
    })
  return data
  }

export {
  apiPost,
  apiGet
}
