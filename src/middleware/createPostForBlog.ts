import { param } from "express-validator"
import { errorHas } from "./errorHas"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import { postInputValidator } from "../helpers/postInputValidator";

export const createPostForBlogMiddleware = [
    ...postInputValidator,

    param('id').custom(checkForExistingBlog)
        .withMessage(message.notExist),

    errorHas
]