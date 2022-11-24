import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'
import { httpStatus } from "../enums/httpEnum";

export const errorHas = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if(error.isEmpty()) {
      return next()  
    }
    return res.status(httpStatus.badRequest).json({errors: error.array()})    
}