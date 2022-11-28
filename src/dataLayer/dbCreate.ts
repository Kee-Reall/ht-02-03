import { MongoClient } from "mongodb"
import {postViewModel} from "../models/postsModel";
import {blogViewModel} from "../models/blogModel";

const dbUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017"
export const client = new MongoClient(dbUri)
export const db = client.db('ht-03')

async function createCollections(): Promise<boolean> {
    try {
        const existedCollectionsList: any[] = await db.listCollections().toArray()
        const existedCollections: string[] = existedCollectionsList.map(el=> el.name )
        if(!existedCollections.includes('posts')) {
            await db.createCollection('posts')
        }
        if(!existedCollections.includes('blogs')) {
            await db.createCollection('blogs')
        }
        return true
    } catch (e){
        console.log('something went wrong from db create')
        return false
    }
}

export const posts = db.collection<postViewModel>('posts')
export const blogs = db.collection<blogViewModel>('blogs')

export async function runDb(): Promise<void> {
    try {
        await client.connect()
        await client.db('test').command({ping: 1})
        await client.db()
        console.log('db Connection success\n Creating required collections')
        const result = await createCollections()
        console.log( result ? 'collections are up' : 'check for collections, something went wrong')
    }
    catch (error) {
        console.log('Cannot connect to db \n' + error)
        await client.close()
    }
}