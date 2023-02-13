import {Request, Response, NextFunction} from "express";
import {JwtService} from "../services/jwt-service";
import {httpStatus} from "../enums/httpEnum";
import {userContainer} from "../containers/userContainer";

export async function refreshAuth(req: Request,res: Response,next: NextFunction) {
    const { cookies: { refreshToken }} = req
    const jwtService = userContainer.resolve(JwtService)
    const meta = await jwtService.verifyRefreshToken(refreshToken)
    if(!meta) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    req.tokenMetaDates = meta
    next()
}