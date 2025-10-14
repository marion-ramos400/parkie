
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import UserController from '../controllers/user.controller.js'
import Auth from '../middleware/auth.js'

class TestUtilsUser {
  constructor(payload, mock) {
    this.payload = payload
    this.pwdCopy = payload.password
    this.req = mock.request(payload)
    this.res = mock.response()
    this.next = mock.next
    this.userControl = new UserController()
  }

  async hashUserPassword() {
    await hashPassword(this.req, this.res, this.next)
    return this
  }
  async createUser() {
    await this.userControl.create(this.req, this.res)
    //reset password to orig value
    this.req.body.password = this.pwdCopy
    return this 
  }

  async validateUserLogin() {
    await validateLogin(this.req, this.res, this.next)
    return this 
  }
  
  async loginUser() {
    await this.userControl.login(this.req, this.res)
    return this 
  }

  async createThenLogin() {
    await this.hashUserPassword()
      .then(()=>this.createUser())
      .then(()=>this.validateUserLogin())
      .then(()=>this.loginUser())
    return [this.req, this.res]
  }
}

export {
  TestUtilsUser
}
