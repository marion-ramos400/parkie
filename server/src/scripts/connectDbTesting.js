import dotenv from "dotenv";
dotenv.config({ path: './server/src/.env'});
import { MongoClient } from 'mongodb'
const connectString = process.env.MONGODB_URI
console.log(connectString)
const client = new MongoClient(connectString)

const checkConn = async() => {
  await client.connect()
  console.log('success connect')
  const db = client.db('parkie') 
  const collection = db.collection('users')
  await collection.insertMany([
    { username: 'user1', email: 'user1@email.com', bookings: []},
    { username: 'user2', email: 'user2@email.com', bookings: []},
    { username: 'user3', email: 'user3@email.com', bookings: []},
  ])
  return 'done'
}

checkConn()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
