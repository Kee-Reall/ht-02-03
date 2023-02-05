import mongoose from "mongoose";
import {postDbModel} from "../postsModel";


export const PostSchema = new mongoose.Schema<postDbModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    title: {
        type: String,
        required: true
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
        maxLength: 100,
        required: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString,
        readonly: true
    },
    blogId: {
        type: String,
        ref:"Blog",
        required: true
    },
    blogName: {
        type: String,
        required: true,
        maxLength:15,
        minLength:5,
        trim: true
    }
})