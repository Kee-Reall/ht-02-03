import {userViewModel} from "./userModel";
import {commentsOutputModel} from "./commentsModel";
import {refreshTokenPayload} from "./refreshTokensMeta";

declare global {
    declare namespace Express {
        export interface Request {
            user: userViewModel
            comment: commentsOutputModel
            tokenMetaDates: refreshTokenPayload
        }
    }
}