import { NextFunction, Request, Response } from "express";
import { httpMethod, httpStatus } from "../enums/httpEnum";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    if(req.method === httpMethod.get) {
        return next()
    }
    const auth64 = req.headers.authorization?.split(' ')[1]
    const [login,password] = Buffer.from(auth64 ?? '', 'base64').toString('ascii').split(':')
    if(login === 'admin'&& password === 'qwerty') {
        return next()
    }
    res.sendStatus(httpStatus.notAuthorized)
}