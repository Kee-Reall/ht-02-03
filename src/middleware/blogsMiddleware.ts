import { body } from "express-validator"
import { errorHas } from "./errorHas"
import { message } from "../enums/messageEnum"

export const blogMiddlewares = [
    body('name').exists()
        .withMessage(message.requireField)
        .isString()
        .trim()
        .withMessage(message.invalidType)
        .isLength({min:1,max:15})
        .withMessage(message.length),

    body('description').exists()
        .withMessage(message.requireField)
        .isString()
        .trim()
        .isLength({min:1,max:500})
        .withMessage(message.length),

    body('websiteUrl').exists()
        .withMessage(message.requireField)
        .isString()
        .trim()
        .isLength({min:1,max:15})
        .isURL()
        .withMessage(message.notUrl),

    errorHas
]