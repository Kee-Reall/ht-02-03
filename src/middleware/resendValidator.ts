import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {QueryRepository} from "../repositories/queryRepository";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";
import {iocContainer} from "../containers/iocContainer";

export const resendValidator: RequestHandler[] = [
    body('email')
        .exists().withMessage(message.requireField)
        .isString().withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:150}).withMessage(message.length)
        .isEmail().withMessage(message.invalidType)
        .custom(async (value: string)=> {
            const queryRepository = iocContainer.resolve(QueryRepository)
            const user = await queryRepository.getUserByEmail(value)
            if(!user) throw new Error("does not exist")
            else if(user.confirmation?.isConfirmed) throw new Error("already confirmed")
            else {
                return true
            }
        }),

    hasError(httpStatus.badRequest)
]