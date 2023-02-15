import mongoose from "mongoose";
import {LikeModel} from "../LikeModel";

export const LikeSchema = new mongoose.Schema<LikeModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    target:{
        type: String,
        required: true,
        readonly: true,
    },
    userId:{
        type: String,
        required: true,
        readonly: true,
    },
    login:{
        type: String,
        required: true
    },
    addAt:{
        type: Date,
        default: new Date()
    },
    likeStatus:{
        type: String,
        default: "None",
        enum:['Like','Dislike','None']
    }
})
