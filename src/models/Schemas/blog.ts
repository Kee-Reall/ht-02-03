import mongoose from "mongoose";
import {blogDbModel} from "../blogModel";

export const BlogSchema = new mongoose.Schema<blogDbModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        maxLength:15,
        minLength:5,
        trim: true
    },
    description:{
        type: String,
        required: true,
        maxLength:500,
        minLength:1,
        trim: true
    },
    websiteUrl: {
        type: String,
        required: true,
        maxLength:100,
        minLength:1,
        trim: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
        readonly: true
    }
})