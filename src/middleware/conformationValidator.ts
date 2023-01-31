import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";

export const conformationValidator: RequestHandler[] = [
    body('code')
        .exists().withMessage(message.requireField)
        .isString().withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:100})
        .withMessage(message.length),

    hasError(httpStatus.badRequest)
]