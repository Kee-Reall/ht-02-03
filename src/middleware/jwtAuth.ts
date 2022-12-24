import {NextFunction, Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {jwtService} from "../services/jwt-service";

export const jwtAuth = async (req: Request, res: Response, next: NextFunction ) => {
    if(!req.headers.authorization) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const [authType, token] = req.headers.authorization.split(' ')
    if(authType !== 'Bearer'){
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const user = await jwtService.getUserByToken(token)
    if (user) {
        req.user = user
        return next()
    }
    res.sendStatus(httpStatus.notAuthorized)
}