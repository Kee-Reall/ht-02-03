import {param} from "express-validator"
import {hasError} from "./hasError"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import {postInputValidator} from "../helpers/postInputValidator";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";

export const createPostForBlogMiddleware: RequestHandler[] = [
    ...postInputValidator,
    hasError(httpStatus.badRequest),
    param('id').custom(checkForExistingBlog)
        .withMessage(message.notExist),

    hasError(httpStatus.notFound,false)
]