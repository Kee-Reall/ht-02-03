import mongoose from "mongoose";
import {PostDbModel} from "../postsModel";


export const PostSchema = new mongoose.Schema<PostDbModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 1
    },
    shortDescription: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 100,
        required: true
    },
    content: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 1000,
        required: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString,
        readonly: true
    },
    blogId: {
        type: String,
        required: true
    },
    blogName: {
        type: String,
        required: true,
        maxLength:15,
        minLength:1,
        trim: true
    }
})