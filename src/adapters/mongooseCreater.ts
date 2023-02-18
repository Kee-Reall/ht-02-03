import mongoose from "mongoose";
import * as dotenv from "dotenv";
import {BlogSchema} from "../models/Schemas/blog";
import {PostSchema} from "../models/Schemas/post";
import {UserSchema} from "../models/Schemas/user";
import {CommentSchema} from "../models/Schemas/comments";
import {SessionSchema} from "../models/Schemas/session";
import {AttemptSchema} from "../models/Schemas/attempts";
import {LikeSchema} from "../models/Schemas/like";

dotenv.config()

export async function mRunDb(testMod: boolean = false, link?: string) {
    try {
        const dbUri: string = testMod ? link as string : process.env.MONGO_URI as string
        if (!dbUri) {
            console.log('cant get env variable')
            return false
        }
        await mongoose.connect(dbUri)
        setInterval(()=>{
            Attempts.deleteMany({})
        },3.5e8)
        return true
    } catch (e) {
        console.log('unable to connect')
        await mongoose.disconnect()
        return false
    }
}

const db = mongoose.connection

export const Blogs = db.model("Blog", BlogSchema)
export const Posts = db.model("Post", PostSchema)
export const Users = db.model("User", UserSchema)
export const Comments = db.model("Comment", CommentSchema)
export const Sessions = db.model("Session", SessionSchema)
export const Attempts = db.model("Attempt", AttemptSchema)
export const Likes = db.model("Like", LikeSchema)