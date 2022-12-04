import {NextFunction, Request, Response} from "express";
import {normalizeQuery} from "../helpers/normalizeQuery";

export const configureGetQuery = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    req.query = normalizeQuery(req.query)
    next()
}
