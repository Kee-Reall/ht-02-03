import {userLogicModel,userViewModel} from "./userModel";
import {CommentsViewModel} from "./commentsModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: userViewModel | userLogicModel | null
            comment: CommentsViewModel
        }
    }
}