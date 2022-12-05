import {NextFunction, Request, Response} from "express";
import {normalizeBlogsQuery} from "../helpers/normalizeBlogsQuery";

export const configureGetBlogsQuery = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    req.query = normalizeBlogsQuery(req.query)
    next()
}
