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
  res.json = vi.fn((resdata)=>res)
  return res
}

const mockNext = vi.fn()

export {
  mockRequest,
  mockResponse,
  mockNext
}
