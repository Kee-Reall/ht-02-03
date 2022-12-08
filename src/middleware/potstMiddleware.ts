import { body } from "express-validator"
import { errorHas } from "./errorHas"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import { postInputValidator } from "../helpers/postInputValidator";

export const postMiddlewares = [
    ...postInputValidator,

    body('blogId').exists()
        .withMessage(message.requireField)
        .trim()
        .custom(checkForExistingBlog)
        .withMessage(message.notExist),
        
    errorHas
]