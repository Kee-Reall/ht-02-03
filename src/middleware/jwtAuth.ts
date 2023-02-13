import {NextFunction, Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {JwtService} from "../services/jwt-service";
import {userContainer} from "../containers/userContainer";

export async function jwtAuth (req: Request, res: Response, next: NextFunction ) {
    const jwtService = userContainer.resolve(JwtService)
    if(!req.headers.authorization) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const [authType, token] = req.headers.authorization.split(' ')
    if(authType !== 'Bearer') {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    const user = await jwtService.getUserByToken(token)
    if (!user) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    req.user = user
    next()
}