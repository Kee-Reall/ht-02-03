import {userLogicModel,userViewModel} from "./userModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: userViewModel | userLogicModel | null
        }
    }
}