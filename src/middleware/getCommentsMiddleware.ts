import {param} from "express-validator";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const getCommentsMiddleware = [
    param('id').custom(checkForExistingBlog),
    hasError(httpStatus.notFound,false)
]