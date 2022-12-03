import { body } from "express-validator"
import { errorHas } from "./errorHas"
import { dbStore as store} from "../dataLayer/dbStore";
import {message} from "../enums/messageEnum";

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
        .custom(async (value) => {
            const result = await store.getBlog(value)
            if(!result) {
                throw new Error('blogId does not exist')
            }
            else {
                return true
            }
        })
        .withMessage(message.notExist),
    errorHas
]