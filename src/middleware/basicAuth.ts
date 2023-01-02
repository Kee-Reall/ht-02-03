import { NextFunction, Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";
import {basicAuthHelper} from "../helpers/basicAuthHelper";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const authSuccess: boolean = basicAuthHelper(req)
    if (authSuccess) {
        return next()
    }
    res.sendStatus(httpStatus.notAuthorized)
}