import {param} from "express-validator";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {checkForExistingPost} from "../helpers/checkForExistingPost";
import {RequestHandler} from "express";

export const getCommentsMiddleware: RequestHandler[] = [
    param('id').custom(checkForExistingPost),
    hasError(httpStatus.notFound,false)
]