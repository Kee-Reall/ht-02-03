import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {errorHas} from "./errorHas";

export const loginMiddleware = [
    body('loginOrEmail').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:1, max:100})
        .withMessage(message.length),

    body('password').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:1, max:100})
        .withMessage(message.length),

    errorHas
]