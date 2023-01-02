import {param} from "express-validator";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {checkForExistingPost} from "../helpers/checkForExistingPost";

export const getCommentsMiddleware = [
    param('id').custom(checkForExistingPost),
    hasError(httpStatus.notFound,false)
]