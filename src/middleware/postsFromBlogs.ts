import {param} from "express-validator";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {RequestHandler} from "express";

export const getPostsByBlogMiddleware: Array<RequestHandler> = [
    param('id').custom(checkForExistingBlog),
    hasError(httpStatus.notFound,false)
]