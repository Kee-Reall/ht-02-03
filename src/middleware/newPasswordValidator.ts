import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";

export const newPasswordValidator: RequestHandler[] = [
    body('newPassword').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:6,max:20})
        .withMessage(message.length),

    body('recoveryCode').exists()
        .withMessage(message.requireField)
        .isString().withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:200})
        .withMessage(message.length),

    hasError(httpStatus.badRequest,true)
]