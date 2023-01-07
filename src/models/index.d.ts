import {userViewModel} from "./userModel";
import {commentsOutputModel} from "./commentsModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: userViewModel
            comment: commentsOutputModel
        }
    }
}