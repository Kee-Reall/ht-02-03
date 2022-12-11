import {param} from "express-validator"
import {errorHas} from "./errorHas"
import {message} from "../enums/messageEnum";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import {postInputValidator} from "../helpers/postInputValidator";
import {idErrorHas} from "../helpers/idErrorHas";

export const createPostForBlogMiddleware = [
    ...postInputValidator,
    errorHas,
    param('id').custom(checkForExistingBlog)
        .withMessage(message.notExist),

    idErrorHas
]