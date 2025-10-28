import express from 'express'
import { FloorPlanController } from '../controllers/controllers.js'

const floorplan = new FloorPlanController()

const router = express.Router()
router.get('/company',
  floorplan.getCompanyFloorplans
)

export default router
