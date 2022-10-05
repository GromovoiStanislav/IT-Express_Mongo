import 'dotenv/config'
import {MongoClient} from 'mongodb'

const mongoURL = process.env.mongoURI || ''//'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoURL)
export const dbDemo= client.db('demo')

export async function runDB (){
    try {
        await  client.connect()
        await client.db('demo').command({ping:1})
        //console.log('MongoDB start')
    }catch {
        //console.log(`Can't connect to MongoDB`)
        await client.close()
    }
}