import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'

export const hasError = (errorStatus: number, shouldResponse: boolean = true): (req: Request, res: Response, next: NextFunction) => void => {
    return (req, res, next) => {
        const error = validationResult(req)
        if (error.isEmpty()) {
            return next()
        }
        const errorsMessages = error
            .array({onlyFirstError:true})
            .map(({ msg: message, param: field }) => {
                return {message, field}
            })
        if(shouldResponse){
            return res.status(errorStatus).json({errorsMessages})
        } else {
            return res.sendStatus(errorStatus)
        }
    }
}