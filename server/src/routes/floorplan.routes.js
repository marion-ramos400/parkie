import express from 'express'
import { FloorPlanController } from '../controllers/controllers.js'
import Auth from '../middleware/auth.js'
import { upload } from '../middleware/storage.js'
import { IMG_FILE_LABEL } from '../env.js'
import { FloorPlan } from '../models/models.js'

const floorplan = new FloorPlanController()


const router = express.Router()
router.get('/company',
  Auth.verifyJwt,
  floorplan.getCompanyFloorplans
)

router.post('/create', 
  upload.single(IMG_FILE_LABEL),
  floorplan.create
)

//TODO remove
router.get('/sample',
  async (req, res) => {
    const floorplan = await FloorPlan.findOne({})
    res.status(200).json({ floorplan })
  
  }
)


export default router
