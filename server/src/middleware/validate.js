import qs from 'qs'
import Send from '../http/response.js'
import { User, Slot, FloorPlan, Booking } from '../models/models.js'


class IValidateStrategy {
  name() { throw new Error('Not yet implemented')}
  execute(data) { throw new Error('Not yet implemented')}
  fail(msg, sendCb=null) {
    return { pass: false, msg, sendCb }
  }
  ok() {
    return { pass: true, msg: '', sendCb: null }
  }
}

class ValidateUser extends IValidateStrategy {
  name() { return 'User' }
  execute(data) {}
}

class ValidateSlot extends IValidateStrategy {
  name() { return 'Slot' }
  async execute(slot) {
    if (!slot) {
      return this.fail('missing parameter', Send.badRequest)
    }
    if (!slot.name) {
      return this.fail('missing slot name', Send.badRequest)
    }
      const slotDb = await Slot.findOne({ name: slot.name })
    if (!slotDb) {
      return this.fail(`Slot ${slot.name} not found`, Send.notFound)
    }
    return this.ok()
  }
}

class ValidateFloorplan extends IValidateStrategy {
  name() { return 'Floorplan' }
  execute(floorplan) {}
}

class ValidateBooking extends IValidateStrategy {
  name() { return 'Booking' }
  execute(req, res, next) {}
}

class PayloadInspector {
  constructor() {
    this.validation = null
  }

  setValidation(validationStrategy) {
    this.validation = validationStrategy
  }

  async validate(req, res, next) {
    const valName = this.validation.name()
    try {
      const payload = req.query 
        ? qs.parse(req.query)
        : req.body
      const { pass, msg, sendCb } = await this.validation.execute(payload)
      if (!pass) {
        const errMsg = `${valName} Validation Error: ${msg}`
        if (sendCb) {
          return sendCb(res, null, errMsg)
        }
        return Send.errorMsg(res, errMsg)
      }
      next()
    }
    catch (err) {
      return Send.errorMsg(
        res, 
        `${valName} Validation Error: `
        + `${err.message}`)
    }
  }
}

export {
  ValidateUser,
  ValidateSlot,
  ValidateFloorplan,
  ValidateBooking,
  PayloadInspector,
}
