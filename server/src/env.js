import dotenv from 'dotenv'
dotenv.config({ path: './server/src/.env'});

const {
  MONGODB_URI,
  JWT_SECRET,
  PORT,
  BACKEND_URL,
  DB_NAME,
} = process.env

export {
  MONGODB_URI,
  JWT_SECRET,
  PORT,
  BACKEND_URL,
  DB_NAME,
}
