
import { hashPassword } from '../middleware/hashpassword.js'
import { validateLogin } from '../middleware/validateLogin.js'
import { 
  UserController,
  FloorPlanController
} from '../controllers/controllers.js'
import Auth from '../middleware/auth.js'
import Mock from './mock.js'

class TestUtils {
  constructor(controller, payload=null) {
    this.mock = new Mock()
    this.req = payload ? this.mock.request(payload) : null
    this.res = this.mock.response()
    this.controller = controller
    this.next = this.mock.next
  }

  async create(payload) {
    if (payload) {
      this.req = this.mock.request(payload)
    }
    await this.controller.create(this.req, this.res) 
  }

  async delete() {
    await delay(300)
    await this.controller.delete(this.req, this.res)
  }
}

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
    return [this.req, this.res]
  }

  async validateUserLogin() {
    await validateLogin(this.req, this.res, this.next)
    return [this.req, this.res]
  }
  
  async loginUser() {
    await this.userControl.login(this.req, this.res)
    return [this.req, this.res]
  }

  async createThenLogin() {
    await this.hashUserPassword()
      .then(()=>this.createUser())
      .then(()=>this.validateUserLogin())
      .then(()=>this.loginUser())
    return [this.req, this.res]
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const deleteMockPayloadDb = async (payloadsObj, controller) => {
  const mockhttp = new Mock()
  await delay(300) 
  for(const [key, value] of Object.entries(payloadsObj)) {
    await controller.delete(mockhttp.request(value), mockhttp.response())
  }
}

export {
  TestUtils,
  TestUtilsUser,
  deleteMockPayloadDb,
  delay,
}
