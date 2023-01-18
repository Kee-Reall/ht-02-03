import {cookie} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const refreshTokenValidator = [
    cookie('refreshToken')
        .exists().withMessage(message.requireField)
        .trim().isLength({min:5})
        .isJWT().withMessage(message.invalidType),

    hasError(httpStatus.notAuthorized,false)
]