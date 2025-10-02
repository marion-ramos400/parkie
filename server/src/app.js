import express from 'express'
import cors from 'cors'
import { PORT } from './env.js'

import userRoutes from './routes/user.routes.js'

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ status: "ok"})
})

app.use(express.json())
app.use('/users', userRoutes)

app.listen(PORT, () => {
  console.log(`parkie server online on port: ${PORT}`)
})
