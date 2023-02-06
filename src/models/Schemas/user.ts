import mongoose from "mongoose";
import {confirmation, userDbModel,recovery} from "../userModel";


const ConfirmationScheme = new mongoose.Schema<confirmation>({
    isConfirmed:{
        type: Boolean,
        default: false
    },
    code:{
        type: String,
        default: ''
    },
    confirmationDate:{
        type:Date,
        required: true
    }
},{_id: false})

const RecoveryScheme = new mongoose.Schema<recovery>({
    recoveryCode:{
        type: String,
        default: ''
    },
    expirationDate:{
        type: Date,
        default: new Date()
    }
},{_id: false})

export const UserSchema = new mongoose.Schema<userDbModel>({
    id: {
        type: String,
        required: true,
        readonly: true,
        unique: true
    },
    login:{
        type:String,
        required:true,
        minLength:3,
        maxLength:10,
        unique: true
    },
    email:{
        type:String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 300
    },
    createdAt:{
        type: String,
        default: new Date().toISOString()
    },
    hash:{
        type: String,
        required: true,
        minlength: 5,
    },
    salt: {
        type: String,
        default: "deleteIt"
    },
    confirmation: ConfirmationScheme,
    recovery: RecoveryScheme
})