import { errorHas } from "./errorHas"
import { postInputValidator } from "../helpers/postInputValidator";
import {NextFunction, Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {checkForExistingBlogB} from "../helpers/checkForExistingBlog";

export const createPostForBlogMiddleware = [
    ...postInputValidator,

    async (req: Request, res: Response, next: NextFunction)=> {
        const result = await checkForExistingBlogB(req.params.id)
        if (result) next()
        else {
            res.sendStatus(httpStatus.notFound)
        }
    },

    errorHas
]