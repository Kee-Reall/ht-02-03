import { MongoClient } from "mongodb"
import {postViewModel} from "../models/postsModel";
import {blogViewModel} from "../models/blogModel";

const dbUri: string = process.env.MONGO_URI!
if(!dbUri) {
    throw new Error('you should set a MONGO_URI in .env')
}

export const client = new MongoClient(dbUri)
export const db = client.db('ht-03')
export const posts = db.collection<postViewModel>('posts')
export const blogs = db.collection<blogViewModel>('blogs')

export async function runDb(): Promise<void> {
    try {
        await client.connect()
        await client.db('test').command({ping: 1})
        await client.db()
        console.log('db Connection success\n Creating required collections')
    }
    catch (error) {
        console.log('Cannot connect to db \n' + error)
        await client.close()
    }
}