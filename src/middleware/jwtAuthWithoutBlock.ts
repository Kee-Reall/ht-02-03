import {NextFunction, Request, Response} from "express";
import {JwtService} from "../services/jwt-service";
import {iocContainer} from "../containers/iocContainer";

export async function jwtAuthWithoutBlock (req: Request, res: Response, next: NextFunction ) {
    const jwtService = iocContainer.resolve(JwtService)
    if(!req.headers.authorization) {
        req.unauthorized = true
        return next()
    }
    const [authType, token] = req.headers.authorization.split(' ')
    if(authType !== 'Bearer') {
        req.unauthorized = true
        return next()
    }
    const user = await jwtService.getUserByToken(token)
    if (!user) {
        req.unauthorized = true
        return next()
    }
    req.user = user
    next()
}