import {cookie} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";

export const refreshTokenValidator: RequestHandler[] = [
    cookie('refreshToken')
        .exists().withMessage(message.requireField)
        .isString().trim().isLength({min:10,max:512})
        .isJWT().withMessage(message.invalidType),

    hasError(httpStatus.notAuthorized,false)
]