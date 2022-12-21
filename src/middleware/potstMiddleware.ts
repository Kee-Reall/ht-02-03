import { body } from "express-validator"
import { hasError } from "./hasError"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import { postInputValidator } from "../helpers/postInputValidator";
import {httpStatus} from "../enums/httpEnum";

export const postMiddlewares = [
    ...postInputValidator,

    body('blogId').exists()
        .withMessage(message.requireField)
        .trim()
        .custom(checkForExistingBlog)
        .withMessage(message.notExist),
        
    hasError(httpStatus.badRequest)
]