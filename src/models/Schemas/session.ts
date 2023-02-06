import mongoose from "mongoose";
import {refreshTokensMeta} from "../refreshTokensMeta";
import {generateDeviceId} from "../../helpers/generateDeviceId";

export const SessionSchema = new mongoose.Schema<refreshTokensMeta>({
    userId: {
        type: String,
        required: true,
        readonly: true,
    },
    deviceId:{
        type: String,
        default: generateDeviceId(),
        readonly: true,
        unique: true
    },
    updateDate:{
        type: Date,
        default: new Date(),
    },
    ip:{
        type: [String],
        default: []
    },
    title:{
        type: String,
        required: false,
        default: null
    }
})