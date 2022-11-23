import { NextFunction, Request, Response } from "express";
import { httpMethod, httpStatus } from "../enums/httpEnum";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log('im working very well \n thats it')
    console.log(req.method)
    if(req.method === httpMethod.get) {
        console.log('middle')
        next()
        return
    }
    const logNpasBASE64 = req.headers.authorization?.split(' ')[1]
    const [login,password] = logNpasBASE64 ?
        Buffer.from(logNpasBASE64,'base64').toString('ascii').split(':') 
        : ['fail','fail']
    if(login === 'admin' && password === "qwerty") {
        next()
        return
    }
    res.sendStatus(httpStatus.notAuthorized)
}