import InterfaceController from './interface.controller.js'
import Send from '../http/response.js'
import { FloorPlan } from '../models/models.js'

class FloorPlanController extends InterfaceController {
  async create(req, res) {
    try {
      await FloorPlan.create(req.body)
      Send.created(res, null, 'floorplan created') 
    }
    catch (err) {
      Send.error(res, null, 
        `Error creatig floorplan: ${err.message}`)
    }
  }

//  async get(req, res) {
//    //get by filters
//  }
//  async update(req, res) {
//  }
  async delete(req, res) {
    try {
      const { name } = req.body
      await FloorPlan.deleteOne({ name })
      Send.success(res, null, 
        `successfully deleted: ${name}`)
    }
    catch (err) {
      Send.error(res, null, 
        `Error deleting floorplan: ${err.message}`)
    }
  }
}

export default FloorPlanController
