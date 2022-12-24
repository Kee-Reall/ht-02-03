import {body, header} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const updateCommentMiddleware = [
    body('content').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:2, max:3})
        .withMessage(message.length),

    hasError(httpStatus.badRequest),
]