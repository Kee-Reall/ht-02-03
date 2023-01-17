import {cookie} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const refreshValidator = [
    cookie('refreshToken')
        .exists().withMessage(message.requireField)
        .isJWT().withMessage(message.invalidType),

    hasError(httpStatus.notAuthorized,false)
]