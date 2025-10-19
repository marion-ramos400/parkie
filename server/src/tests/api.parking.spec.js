import { 
  describe, 
  test, 
  it, 
  expect, 
  vi,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
  } from 'vitest'
import axios from 'axios'
import HTTP from '../http/codes.js'
import { BACKEND_URL } from '../env.js'


describe('api router parking', async () => {
  it('returns status: ok', async () => {
    let response;
    await axios.get(
      BACKEND_URL + '/parking/test?wut=hello&heyhey=wasap'
      )
      .then(res => response = res)
      .catch(err => console.error(err.message))
      .finally(() => {
        expect(response.status).toBe(HTTP.SUCCESS)
        expect(response.data).toHaveProperty('status')
      })
  })
})
