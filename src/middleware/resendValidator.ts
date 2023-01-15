import {body} from "express-validator";
import {message} from "../enums/messageEnum";
import {queryRepository} from "../repositories/queryRepository";

export const resendValidator = [
    body('email')
        .exists().withMessage(message.requireField)
        .isString().withMessage(message.invalidType)
        .trim()
        .isLength({min:1,max:150}).withMessage(message.length)
        .isEmail().withMessage(message.invalidType)
        .custom(async (value: string)=> {
            const user = await queryRepository.getUserByEmail(value)
            if(!user) throw new Error("does not exist")
            else if(user.confirmation?.isConfirmed) throw new Error("already confirmed")
            else {
                return true
            }
        })

]