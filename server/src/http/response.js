import HTTP from './codes.js'

const setResponse = (res, httpCode, data, msg) => {
  res.status(httpCode).json({
    ...data,
    msg
  })
}

class Send {
  static success(res, data, msg = "success") {
    setResponse(res, HTTP.SUCCESS, data, msg)
    return
  }
  static created(res, data, msg = "created") {
    setResponse(res, HTTP.CREATED, data, msg)
    return
  }
  static error(res, data, msg = "error") {
    setResponse(res, HTTP.ERROR, data, msg)
    return
  }
  static errorMsg(res, msg) {
    setResponse(res, HTTP.ERROR, null, msg)
    return
  }
  static notFound(res, data, msg = "not found") {
    setResponse(res, HTTP.NOT_FOUND, data, msg)
    return
  }
  static unAuthorized(res, data, msg = "unauthorized") {
    setResponse(res, HTTP.UNAUTHORIZED, data, msg)
    return
  }
  static forbidden(res, data, msg = "forbidden") {
    setResponse(res, HTTP.FORBIDDEN, data, msg)
    return
  }
  static badRequest(res, data, msg = "bad request") {
    setResponse(res, HTTP.BAD_REQUEST, data, msg)
    return
  }
}

export default Send
