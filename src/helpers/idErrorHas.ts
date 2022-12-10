import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'
import { httpStatus } from "../enums/httpEnum";

export const idErrorHas = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        return next()
    }
    return res.sendStatus(httpStatus.notFound)
}