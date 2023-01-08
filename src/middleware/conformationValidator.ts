import {body} from "express-validator";
import {message} from "../enums/messageEnum";

export const conformationValidator = body('code')
    .exists().withMessage(message.requireField)
    .isString().withMessage(message.invalidType)
    .trim()
    .isLength({min:1,max:100})
    .withMessage(message.length)
    .custom((value)=>{
// is code inside body exist or expired?
    })
    .withMessage(message.expired)