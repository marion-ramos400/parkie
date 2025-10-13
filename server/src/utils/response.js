
const setResponse = (res, httpCode, data, msg) => {
  res.status(httpCode).json({
    ...data,
    msg
  })
}

class Send {
  static success(res, data, msg = "success") {
    setResponse(res, 200, data, msg)
    return
  }
  static created(res, data, msg = "created") {
    setResponse(res, 201, data, msg)
    return
  }
  static error(res, data, msg = "error") {
    setResponse(res, 500, data, msg)
    return
  }
  static notFound(res, data, msg = "not found") {
    setResponse(res, 400, data, msg)
    return
  }
  static unAuthorized(res, data, msg = "unauthorized") {
    setResponse(res, 401, data, msg)
    return
  }
  static forbidden(res, data, msg = "forbidden") {
    setResponse(res, 403, data, msg)
    return
  }
  static badRequest(res, data, msg = "bad request") {
    setResponse(res, 400, data, msg)
    return
  }
}

export default Send
