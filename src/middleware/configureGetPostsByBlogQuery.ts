import {NextFunction, Request, Response} from "express";
import {normalizePostsByBlogsQuery} from "../helpers/normalizePostsByBlogsQuery";

export const configureGetPostsByBlogQuery = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    req.query = normalizePostsByBlogsQuery(req.query)
    next()
}
