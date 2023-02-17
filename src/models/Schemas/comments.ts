import mongoose from "mongoose";
import {CommentsDbModel} from "../commentsModel";



const CommentatorInfoSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    userLogin:{
        type: String,
        required: true
    }
},{versionKey: false, _id: false})
export const CommentSchema = new mongoose.Schema<CommentsDbModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    content:{
        type: String,
        trim: true,
        required: true,
        maxLength:300,
        minLength:3
    },
    commentatorInfo: CommentatorInfoSchema,
    postId:{
        type: String,
        required: true,
    },
    createdAt:{
        type: String,
        default: new Date().toISOString
    }
})