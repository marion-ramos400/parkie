import qs from 'qs'
import Send from '../http/response.js'
import { User, Slot, FloorPlan, Booking } from '../models/models.js'


class IValidateStrategy {
  name() { throw new Error('Not yet implemented')}
  execute(data) { throw new Error('Not yet implemented')}
  fail(msg, sendCb=null) {
    return { pass: false, msg, sendCb, reqAdd: null }
  }
  ok(reqAdd=null) {
    return { pass: true, msg: '', sendCb: null, reqAdd }
  }
}

class ValidateUser extends IValidateStrategy {
  name() { return 'User' }
  execute(data) {}
}

class ValidateReservedTo extends IValidateStrategy {
  name() { return 'Reserved To '}
  async execute(data) {
    const { reservedTo } = data
    if (!reservedTo) {
      return this.fail('missing reservedTo parameter', Send.badRequest)
    }
    const user = await User.findOne({ email: reservedTo })
    if (!user) {
      return this.fail('user not found', Send.notFound)
    }
    return this.ok({ reservedTo: user })
  }
}

class ValidateSlot extends IValidateStrategy {
  name() { return 'Slot' }
  async execute(data) {
    const { slot } = data
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
    return this.ok({ slot: slotDb})
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
  async execute(data) {
    const { floorplan } = data
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

    return this.ok({ floorplan: flrplan })
  }
}

class ValidateBooking extends IValidateStrategy {
  name() { return 'Booking' }
  execute(req, res, next) {}
}

class Validator {
  constructor() {
    this.validation = new ValidateSlot()
  }

  setValidation(validationStrategy) {
    this.validation = validationStrategy
  }

  async validate(req, res, next) {
    const valName = this.validation.name()
    try {
      const payload = req.query && req.query.length > 0
        ? qs.parse(req.query)
        : req.body
      const { pass, msg, sendCb, reqAdd } = await this.validation.execute(payload)
      if (reqAdd) {
        req.body = {...req.body, ...reqAdd}
      }
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


class ReservedToInspector {
  async inspect(req, res, next) {
    const pi = new Validator() 
    pi.setValidation(new ValidateReservedTo())
    return pi.validate(req, res, next)
  }
}

class SlotInspector {
  async inspect(req, res, next) {
    const pi = new Validator() 
    pi.setValidation(new ValidateSlot())
    return pi.validate(req, res, next)
  }
}

class FloorPlanInspector {
  async inspect(req, res, next) {
    const pi = new Validator() 
    pi.setValidation(new ValidateFloorplan())
    return pi.validate(req, res, next)
  }
}

class SlotInFloorPlanInspector {
  async inspect(req, res, next) {
    const pi = new Validator() 
    pi.setValidation(new ValidateSlotInFloorplan())
    return pi.validate(req, res, next)
  }
}

const payloadInspector = {
  reservedTo: new ReservedToInspector(),
  slot: new SlotInspector(),
  floorplan: new FloorPlanInspector(),
  slotInFloorplan: new SlotInFloorPlanInspector()
}

export default payloadInspector;
