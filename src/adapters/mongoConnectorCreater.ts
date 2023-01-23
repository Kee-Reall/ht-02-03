import { MongoClient } from "mongodb"
import {postViewModel} from "../models/postsModel";
import {blogViewModel} from "../models/blogModel";
import {userDbModel} from "../models/userModel";
import {commentsDbModel} from "../models/commentsModel";
import * as dotenv from 'dotenv'  // idk why but it repairs supertest inside tests
dotenv.config()

const dbUri: string = process.env.MONGO_URI as string
if(!dbUri) {
    throw new Error('you should set a MONGO_URI in .env')
}

export const client = new MongoClient(dbUri)
export const db = client.db('ht-03')
export const posts = db.collection<postViewModel>('posts')
export const blogs = db.collection<blogViewModel>('blogs')
export const users = db.collection<userDbModel>('users')
export const comments = db.collection<commentsDbModel>('comments')
export async function runDb(): Promise<boolean> {
    try {
        await client.connect()
        await client.db('test').command({ping: 1})
        console.log('db Connection success\n Creating required collections')
        return true
    } catch (error) {
        console.log('Can not connect to db \n' + error)
        await client.close()
        return false
    }
}