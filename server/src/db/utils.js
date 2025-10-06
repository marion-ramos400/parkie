import mongoose from 'mongoose'
import { MONGODB_URI, DB_NAME } from '../env.js'

const connectDB = async () => {
  try {
    await mongoose.connect(
      MONGODB_URI, 
      { dbName: DB_NAME }
    )
  }
  catch (error) {
    console.error(
      `Error connecting to database: ${error.message}`
    )
  }
}

export {
  connectDB
}
