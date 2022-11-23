import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'

export const errorHas = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if(error.isEmpty()) {
      return next()  
    }
    return res.status(400).json({errors: error.array()})    
}