import { body } from "express-validator"
import { errorHas } from "./errorHas"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";

export const postMiddlewares = [
    body('title').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:30})
        .withMessage(message.length),

    body('shortDescription').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:100})
        .withMessage(message.length),

    body('content').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:1000})
        .withMessage(message.length),

    body('blogId').exists()
        .withMessage(message.requireField)
        .trim()
        .custom(checkForExistingBlog)
        .withMessage(message.notExist),
    errorHas
]