import express from 'express'
import { FloorPlanController } from '../controllers/controllers.js'
import Auth from '../middleware/auth.js'

const floorplan = new FloorPlanController()

const router = express.Router()
router.get('/company',
  Auth.verifyJwt,
  floorplan.getCompanyFloorplans
)

export default router
