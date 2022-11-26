import { body } from "express-validator"
import { errorHas } from "./errorHas"
import { store } from "../dataLayer/store";

export const postMiddlewares = [
    body('title').exists()
        .isString()
        .trim()
        .isLength({min:1,max:30}),

    body('shortDescription').exists()
        .isString()
        .trim()
        .isLength({min:1,max:100}),

    body('content').exists()
        .isString()
        .trim()
        .isLength({min:1,max:1000}),

    body('blogId').exists()
        .trim()
        .custom((value) => {
        const result = store.getBlog(value)
        if(!result) {
            throw new Error('blogId does not exist')
        }
        else {
            return true
        }
    }),
    errorHas
]