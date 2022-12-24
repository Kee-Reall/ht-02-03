import { NextFunction, Request, Response } from "express";
import { httpMethod, httpStatus } from "../enums/httpEnum";
import {basicAuthHelper} from "../helpers/basicAuthHelper";

export const basicAuthWithoutGet = (req: Request, res: Response, next: NextFunction) => {
    if(req.method === httpMethod.get) {
        return next()
    }
    const authSuccess: boolean = basicAuthHelper(req)
    if (authSuccess) {
        return next()
    }
    res.sendStatus(httpStatus.notAuthorized)
}