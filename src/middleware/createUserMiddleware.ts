import {body} from "express-validator";
import {RequestHandler} from "express";
import {message} from "../enums/messageEnum";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {userContainer} from "../containers/userContainer";
import {QueryRepository} from "../repositories/queryRepository";


export const createUserMiddleware: RequestHandler[] = [
    body('login').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:3,max:10})
        .withMessage(message.length)
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage(message.symbols)
        .custom(async (value: string)=>{
            const queryRepository = userContainer.resolve(QueryRepository)
            const checker = await queryRepository.getUserByLogin(value)
            if(checker){
                throw new Error('Login already exists')
            } else {
                return true
            }
        }),

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
        .withMessage(message.invalidType)
        .custom(async (value: string)=>{
            const queryRepository = userContainer.resolve(QueryRepository)
            const checker = await queryRepository.getUserByEmail(value)
            if(checker){
                throw new Error('email already in use')
            } else {
                return true
            }
        }),

    hasError(httpStatus.badRequest)
]