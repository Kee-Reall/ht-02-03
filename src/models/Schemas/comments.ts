import mongoose from "mongoose";
import {commentsDbModel} from "../commentsModel";


export const CommentSchema = new mongoose.Schema<commentsDbModel>({
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
    userId:{
        type: String,
        required: true,
    },
    userLogin:{
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true,
    },
    createdAt:{
        type: String,
        default: new Date().toISOString
    }
})