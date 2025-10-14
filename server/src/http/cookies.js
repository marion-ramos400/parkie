
class Cookies {
  static set(res, cookieName, cookieData, maxAge) {
    res.cookie(cookieName, cookieData, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: "None",
      partitioned: true,
    })
  }
  static clear(res, cookieName) {
    res.clearCookie(cookieName, { partitioned: true })
  }
}

export default Cookies;
