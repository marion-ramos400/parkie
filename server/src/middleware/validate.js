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

class ValidateSlotInFloorplan extends IValidateStrategy {
  name() { return 'Slot in FloorPlan'}
  async execute(data) {
    const { slot, floorplan } = data
    if (!slot) {
      return this.fail('missing slot parameter', Send.badRequest)
    }
    if (!slot.name) {
      return this.fail('missing slot name', Send.badRequest)
    }
    if (!floorplan) {
      return this.fail('missing floorplan parameter', Send.badRequest)
    }
    if (!floorplan._id) {
      return this.fail('missing floorplan._id parameter', Send.badRequest)
    }

    const flrplan = await FloorPlan.findOne({ _id: floorplan._id })
    if (!flrplan) {
      return this.fail('floorplan not found', Send.notFound)
    }
    
    const slotDb = await Slot.findOne({ name: slot.name, floorplan: floorplan._id})
    if (!slotDb) {
      return this.fail(`slot ${slot.name} not found in floorplan`, Send.notFound)
    }

    return this.ok()
  }
}

class ValidateFloorplan extends IValidateStrategy {
  name() { return 'Floorplan' }
  async execute(floorplan) {
    if (!floorplan) {
      return this.fail('missing floorplan', Send.badRequest)
    }
    if (!floorplan.name) {
      return this.fail('missing floorplan.name parameter', Send.badRequest)
    }

    const flrplan = await FloorPlan.findOne({ name: floorplan.name })
    if (!flrplan) {
      return this.fail('floorplan not found', Send.notFound)
    }

    return this.ok()
  }
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
  ValidateSlotInFloorplan,
  ValidateBooking,
  PayloadInspector,
}
