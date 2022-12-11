import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {errorHas} from "./errorHas";

export const createUserMiddleware = [
    body('login').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:3,max:10})
        .withMessage(message.length)
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage(message.symbols),

    body('password').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:6,max:20})
        .withMessage(message.length),

    body('email').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isEmail()
        .withMessage(message.invalidType),

    errorHas
]