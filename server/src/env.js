import dotenv from 'dotenv'
dotenv.config({ path: './server/src/.env'});


const {
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRE,
  REFRESH_SECRET,
  REFRESH_EXPIRE,
  PORT,
  BACKEND_URL,
  DB_NAME,
  UPLOADS_PATH,
  IMG_FILE_LABEL,
} = process.env

const getMaxAgeForCookie = (envar) => { 
  const suff = envar[envar.length-1]
  const num = parseInt(envar.split(suff)[0])
  if (suff === 'h') {
    return num * 60 * 60 * 1000 
  }
  else if (suff === 'm') {
    return num * 60 * 1000
  }
  else if (suff === 's') {
    return num * 1000
  }
  throw new Error(`Can't convert max Age properly for ${envar}`)
}

const JWT_MAX_AGE = getMaxAgeForCookie(JWT_EXPIRE)
const REFRESH_MAX_AGE = getMaxAgeForCookie(REFRESH_EXPIRE)

export {
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_MAX_AGE,
  REFRESH_SECRET,
  REFRESH_EXPIRE,
  REFRESH_MAX_AGE,
  PORT,
  BACKEND_URL,
  DB_NAME,
  UPLOADS_PATH,
  IMG_FILE_LABEL,
}
