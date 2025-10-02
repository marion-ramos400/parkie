import dotenv from 'dotenv'
dotenv.config({ path: './server/src/.env'});

const {
  JWT_SECRET,
  PORT
} = process.env

export {
  JWT_SECRET,
  PORT
}
