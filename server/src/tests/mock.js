import { vi } from 'vitest'

class MResponse {
  constructor() {
    this.cookies = {}
    this.status = vi.fn((code)=>this)
    this.json = vi.fn((resdata) => {
      this.data = resdata
      return this
    })
    this.cookie = vi.fn((cookieName, cookieData, options) => {
      this.cookies[cookieName] = cookieData
      return this
    })
  }
}

class Mock {
  constructor() {
    this.res = new MResponse()
    this.next = vi.fn()
  }
  request(body) {
    return { body } 
  }
  response() {
    return this.res
  }
  clear() {
    this.res = new MResponse()
  }
}

export default Mock
