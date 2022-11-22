import { NextFunction, Request, Response } from "express";
import { httpMethod, httpStatus } from "../enums/httpEnum";

export const basicAuth = ({method, headers:{authorization}}: Request, res: Response, next: NextFunction) => {
    if(method === httpMethod.get) next()
    const logNpasBASE64 = authorization?.split(' ')[1]
    const [login,password] = logNpasBASE64 ?
        Buffer.from(logNpasBASE64,'base64').toString('ascii').split(':') 
        : ['fail','fail']
    if(login === 'admin' && password === "qwerty") next()
    res.sendStatus(httpStatus.notAuthorized)
}