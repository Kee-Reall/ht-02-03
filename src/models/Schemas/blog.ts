import mongoose from "mongoose";

export const BlogSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        readonly: true
    },
    name:{
        type: String,
        require: true,
        maxLength:15,
        minLength:5,
        trim: true
    },
    description:{
        type: String,
        require: true,
        maxLength:500,
        minLength:1,
        trim: true
    },
    websiteUrl: {
        type: String,
        require: true,
        maxLength:100,
        minLength:1,
        trim: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        readonly: true
    }
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})