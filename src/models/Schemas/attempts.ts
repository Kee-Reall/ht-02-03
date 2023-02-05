import mongoose from "mongoose";
import {attemptsModel} from "../attemptsModel";

export const AttemptsSchema = new mongoose.Schema<attemptsModel>({
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