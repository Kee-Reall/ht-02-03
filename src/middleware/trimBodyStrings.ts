import { NextFunction, Request, Response } from "express";

//this middleware break an redault

export const trimBodyStrings = (req: Request, res: Response, next: NextFunction) => {
    if(req.body) {
        for(let key in req.body) {
            if(typeof key === 'string') {
                req.body[key] = req.body[key].trim()
            }
        }
    }
    next()
}