import {NextFunction, Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {jwtService} from "../services/jwt-service";

export const jwtAuth = async (req: Request, res: Response, next: NextFunction ) => {
    if(!req.headers.authorization) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const [authType, token] = req.headers.authorization.split(' ')
    if(authType !== 'Bearer') {
        console.log('2')
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const user = await jwtService.getUserByToken(token)
    if (user) {
        req.user = user
        console.log(4)
        next()
        return
    } else {
        console.log('3')
        res.sendStatus(httpStatus.notAuthorized)
    }
}