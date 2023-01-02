import {userViewModel} from "./userModel";
import {CommentsOutputModel} from "./commentsModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: userViewModel
            comment: CommentsOutputModel
        }
    }
}