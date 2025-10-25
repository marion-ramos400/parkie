import express from 'express'
import { BookController } from '../controllers/controllers.js'
import * as va from '../middleware/validate.js'

//TODO add verify User or verify Jwt
const bookControl = new BookController()
const inspectors = va.setInspectors([
  new va.Validator(new va.ValidateReservedTo()),
  new va.Validator(new va.ValidateSlot()),
  new va.Validator(new va.ValidateFloorplan()),
  new va.Validator(new va.ValidateSlotInFloorplan()),
  new va.Validator(new va.ValidateSlotCompany()),
])

const router = express.Router()
router.post('/create', 
  ...inspectors,
  bookControl.create
)

export default router
