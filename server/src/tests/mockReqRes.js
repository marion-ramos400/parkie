import { vi } from 'vitest'

const mockRequest = (sessionData, body) => {
  return {
    session: { data: sessionData },
    body,
  }
}

const mockResponse = () => {
  const res = { cookies: {} }
  res.status = vi.fn((code)=>res)
  res.json = vi.fn((resdata)=>{
    res.data = resdata
    return res
  })
  res.cookie = vi.fn(
    (cookieName, cookieData, options)=>{
      res.cookies[cookieName] = cookieData
      return res
    }
  )
  return res
}

const mockNext = vi.fn()

export {
  mockRequest,
  mockResponse,
  mockNext,
}
