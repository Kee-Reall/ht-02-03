import { body } from "express-validator"
import { message} from "../enums/messageEnum";

export const postInputValidator = [
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
        .withMessage(message.length)
]