import multer from 'multer'
import { promises as fs } from 'fs'
import path from 'path'
import { UPLOADS_PATH } from '../env.js'
import Send from '../http/response.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_PATH)
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage: storage,
})

const removeUploadedFile = async (fname) => {
  const fpath = path.join(UPLOADS_PATH, fname)
  await fs.access(fpath)
  await fs.unlink(fpath)
}


export {
  upload,
  removeUploadedFile
}
