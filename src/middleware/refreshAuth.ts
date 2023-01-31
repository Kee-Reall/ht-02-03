import {Request, Response, NextFunction} from "express";
import {jwtService} from "../services/jwt-service";
import {httpStatus} from "../enums/httpEnum";

export async function refreshAuth(req: Request,res: Response,next: NextFunction) {
    const { cookies: { refreshToken }} = req
    const meta = await jwtService.verifyRefreshToken(refreshToken)
    if(!meta) {
        return res.sendStatus(httpStatus.notAuthorized)
    }
    req.tokenMetaDates = meta
    next()
}