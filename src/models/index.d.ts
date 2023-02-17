import {UserViewModel} from "./userModel";
import {CommentsOutputModel} from "./commentsModel";
import {RefreshTokenPayload} from "./refreshTokensMeta";

declare global {
    declare namespace Express {
        export interface Request {
            unauthorized: undefined | boolean
            user: UserViewModel
            comment: CommentsOutputModel
            tokenMetaDates: RefreshTokenPayload
        }
    }
}