import {RequestHandler} from "express";
import { validationResult } from 'express-validator'

export const hasError = (errorStatus: number, shouldResponse: boolean = true): RequestHandler => {
    return (req, res, next) => {
        const error = validationResult(req)
        if (error.isEmpty()) {
            return next()
        }
        if(shouldResponse){
            return res.status(errorStatus).json({errorsMessages: error
                    .array({onlyFirstError:true})
                    .map(({ msg: message, param: field }) => {
                        return {message, field}
                    })
            })
        } else {
            return res.sendStatus(errorStatus)
        }
    }
}