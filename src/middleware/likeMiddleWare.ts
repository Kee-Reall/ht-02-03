import {body} from "express-validator";
import {RequestHandler} from "express";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {likeEnum} from "../enums/likeEnum";

export const likeMiddleWare: RequestHandler[] = [
    body('likeStatus')
        .exists()
        .withMessage(message.notExist)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .custom( value => {
            const isValidValue = (value === likeEnum.like) || (value === likeEnum.dislike) || (value === likeEnum.none)
            if (isValidValue) return true
            else throw new Error(message.forbiddenValue)
        }),
    hasError(httpStatus.badRequest)
]