import {query} from "express-validator";
import {message} from "../enums/messageEnum";
import {errorHas} from "./errorHas";

export const getBlogsMiddleware = [
    query('searchNameTerm').exists()
        .withMessage(message.requireField)
        .trim()
        .isLength({min:1,max:500})
        .withMessage(message.length),

    query('sortBy').exists()
        .withMessage(message.requireField)
        .trim()
        .isLength({min:1,max:500})
        .withMessage(message.length),

    errorHas
]