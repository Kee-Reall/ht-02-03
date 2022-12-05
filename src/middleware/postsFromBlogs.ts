import {query, param} from "express-validator";
import {message} from "../enums/messageEnum";
import {errorHas} from "./errorHas";
import {configureGetBlogsQuery} from "./configureGetBlogsQuery";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";

export const getPostsByBlogMiddleware = [
    query('sortBy').exists()
        .withMessage(message.requireField)
        .trim()
        .isLength({min:1,max:500})
        .withMessage(message.length),

    param('id').custom(checkForExistingBlog),
    errorHas, configureGetBlogsQuery
]