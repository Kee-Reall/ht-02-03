import {RequestHandler} from "express";
import {body} from "express-validator";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const emailValidator: RequestHandler[] = [
    body('email')
        .isString().trim()
        .isEmail().isLength({min:1,max:150}),

    hasError(httpStatus.badRequest,false)
]