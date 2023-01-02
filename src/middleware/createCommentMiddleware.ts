import { body, param } from "express-validator";
import { httpStatus } from "../enums/httpEnum";
import { message } from "../enums/messageEnum";
import { checkForExistingPost } from "../helpers/checkForExistingPost";
import { hasError } from "./hasError";

export const createCommentMiddlewares = [
    body('content').exists()
        .withMessage(message.requireField)
        .isString()
        .withMessage(message.invalidType)
        .trim()
        .isLength({min:20,max:600}),

    hasError(httpStatus.badRequest),

    param('id').custom(checkForExistingPost).withMessage(message.notExist),

    hasError(httpStatus.notFound, false)
]