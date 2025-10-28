import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PORT } from './env.js'
import { connectDB } from './db/utils.js'
import {
  userRouter,
  bookingRouter,
  parkingRouter,
  floorPlanRouter,
} from './routes/routes.js'

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ status: "ok"})
})

app.use(express.json())
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use('/users', userRouter)
app.use('/parking', parkingRouter)
app.use('/booking', bookingRouter)
app.use('/floorplans', floorPlanRouter)

const runServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`parkie server online on port: ${PORT}`)
    })
  }
  catch (error) {
    console.error(`Failed to start server: ${error.message}`)
  }
}
runServer()

