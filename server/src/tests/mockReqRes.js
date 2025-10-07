import { vi } from 'vitest'

const mockRequest = (sessionData, body) => {
  return {
    session: { data: sessionData },
    body
  }
}

const mockResponse = () => {
  const res = {}
  res.status = vi.fn((code)=>res)
  res.json = vi.fn((resdata)=>{
    res.data = resdata
    return res
  })
  return res
}

const mockNext = vi.fn()

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export {
  mockRequest,
  mockResponse,
  mockNext,
  sleep
}
