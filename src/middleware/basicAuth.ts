import { NextFunction, Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization?.split(' ')
    if(!Array.isArray(auth)){
        res.sendStatus(httpStatus.notAuthorized)
        return
    }
    const [type,auth64] = auth
    const [login,password] = Buffer.from(auth64 ?? '', 'base64').toString('ascii').split(':')
    const [adminLogin, adminPassword] = [process.env.LOGIN, process.env.PASSWORD]
    if(login === adminLogin && password === adminPassword && type === 'Basic') {
        return next()
    }
    res.sendStatus(httpStatus.notAuthorized)
}