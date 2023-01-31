import {Request, Response} from "express";
import {securityService} from "../services/security-service";
import {httpStatus} from "../enums/httpEnum";

class SecurityController {
    public async getAllSessions({tokenMetaDates}: Request,res: Response){
        const data = await securityService.getAllSessionsByToken(tokenMetaDates.userId)
        if(!data) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok).json(data)
    }

    public async killOthersSessions(req: Request, res: Response) {
        const {tokenMetaDates: {deviceId, userId}} = req
        res.sendStatus(
            await securityService.killAllForUser({deviceId,userId}) ? httpStatus.noContent : httpStatus.teapot
        )
    }

    public async killSession(req: Request, res: Response) {
        const {tokenMetaDates,params:{deviceId}} = req
        const isKilled = await securityService.killSession(tokenMetaDates,deviceId)
        res.sendStatus(isKilled ? httpStatus.noContent : httpStatus.forbidden)
    }
}

export const securityController = new SecurityController()