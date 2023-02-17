import mongoose from "mongoose";
import {AttemptsModel} from "../attemptsModel";

export const AttemptSchema = new mongoose.Schema<AttemptsModel>({
    endpointAndIp:{
        type: String,
        required: true
    },
    date:{
        type: String,
        default: new Date().toISOString()
    }
},{
     versionKey: false
})