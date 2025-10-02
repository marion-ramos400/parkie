import { test, it, expect } from 'vitest'
import axios from 'axios'


it('logs in and gives back token', () => {
  let data;
  axios.post(
    'http://localhost:3000/users/login', 
    {
      username: 'user1',
      password: 'user'
    })
    .then(res => {
      data = res.data
    })
    .catch(err => {
    })
    .finally(() => {
      console.log(data)
      expect(data).toHaveProperty('token')
    })

})


