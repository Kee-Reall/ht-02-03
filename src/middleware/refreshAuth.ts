import {Request, Response, NextFunction} from "express";
import {JwtService} from "../services/jwt-service";
import {httpStatus} from "../enums/httpEnum";
import {iocContainer} from "../containers/iocContainer";

export async function refreshAuth(req: Request,res: Response,next: NextFunction) {
    const { cookies: { refreshToken }} = req
    const jwtService = iocContainer.resolve(JwtService)
    const meta = await jwtService.verifyRefreshToken(refreshToken)
    if(!meta) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    req.tokenMetaDates = meta
    next()
}