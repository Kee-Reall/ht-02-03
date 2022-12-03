import { body } from "express-validator"
import { errorHas } from "./errorHas"
import { message } from "../enums/messageEnum"

export const blogMiddlewares = [
    body('name').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
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
        .withMessage("not string")
        .trim()
        .isLength({min:1,max:100})
        .withMessage("need to change length")
        .isURL()
        .withMessage(message.notUrl),

    errorHas
]