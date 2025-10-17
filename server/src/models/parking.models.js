import mongoose from 'mongoose'
const parkingSchema = new mongoose.Schema({
  floor: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  datePark: {
    type: Date
  },
  dateBook: {
    type: Date
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  ticketnum: {
    type: String,
    required: true,
    unique: true
  },
  uiRect: {
    type: Map,
    of: mongoose.Schema.Types.Int32
  }
  //add qrCode or barCode?
})

const Parking = mongoose.model('Parking', parkingSchema)
export default Parking

