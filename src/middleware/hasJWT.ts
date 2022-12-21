import {header} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const hasJWT = [
    header('Authorization')
        .exists()
        .withMessage(message.requireField)
        .isJWT()
        .withMessage(message.invalidType),

    hasError(httpStatus.notAuthorized,false),

]