import {NextFunction, Request, Response} from "express";

export const testMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    console.log('im working')
    console.log(req.user)
    next()
}