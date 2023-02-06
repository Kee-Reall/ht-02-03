import mongoose from "mongoose";
import {BlogSchema} from "../models/Schemas/blog";
import {PostSchema} from "../models/Schemas/post";
import {UserSchema} from "../models/Schemas/user";
import {CommentsSchema} from "../models/Schemas/comments";
import {SessionSchema} from "../models/Schemas/session";
import {AttemptsSchema} from "../models/Schemas/attempts";
import * as dotenv from "dotenv";
dotenv.config()

export async function mRunDb(){
    try {
        const dbUri: string = process.env.MONGO_URI as string
        if(!dbUri) {
            console.log('cant get env variable')
            return false
        }
        await mongoose.connect(`${dbUri}/ht10`)
        return true
    } catch (e){
        console.log('unable to connect')
        await mongoose.disconnect()
        return false
    }
}

const db = mongoose.connection

export const Blogs = db.model("Blog",BlogSchema)
export const Posts = db.model("Post",PostSchema)
export const Users = db.model("User",UserSchema)
export const Comments = db.model("Comment",CommentsSchema)
export const Sessions = db.model("Session",SessionSchema)
export const Attempts = db.model("Attempt", AttemptsSchema)