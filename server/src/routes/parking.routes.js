import express from 'express'

const router = express.Router()
router.get('/test', (req, res) => {
  console.log(req.query)
  console.log(req.query.wut)
  res.status(200).json({status: 'ok'})

})

export default router
