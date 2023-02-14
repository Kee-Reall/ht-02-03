import {MongoClient} from "mongodb"
import {PostViewModel} from "../models/postsModel";
import {BlogViewModel} from "../models/blogModel";
import {UserDbModel} from "../models/userModel";
import {CommentsDbModel} from "../models/commentsModel";
import * as dotenv from 'dotenv'
import {RefreshTokensMeta} from "../models/refreshTokensMeta";
import {AttemptsModel} from "../models/attemptsModel";  // idk why but it repairs supertest inside tests
dotenv.config()

const dbUri: string = process.env.MONGO_URI as string
if (!dbUri) {
    throw new Error('you should set a MONGO_URI in .env')
}

export const client = new MongoClient(dbUri)
export const db = client.db('ht-03')
export const posts = db.collection<PostViewModel>('posts')
export const blogs = db.collection<BlogViewModel>('blogs')
export const users = db.collection<UserDbModel>('users')
export const comments = db.collection<CommentsDbModel>('comments')

export const sessions = db.collection<RefreshTokensMeta>('sessions')
export const attempts = db.collection<AttemptsModel>('attempts')

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