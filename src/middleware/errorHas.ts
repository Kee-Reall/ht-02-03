import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'
import { httpStatus } from "../enums/httpEnum";

export const errorHas = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if (error.isEmpty()) {
        return next()
    }
    const errorsMessages = error.array()
        .map(el=> el.param)
        .filter((el,i,ar)=> ar.indexOf(el)===i)
        .map(el=>{
        return {
            message: 'Check next fields',
            field: el
        }
    })
    // const errorsMessages = error.array()
    //     .map(({ msg: message, param: field }) => {
    //         return {message, field}
    //     })
    return res.status(httpStatus.badRequest).json({errorsMessages})
}