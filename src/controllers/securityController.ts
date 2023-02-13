import {Request, Response} from "express";
import {SecurityService} from "../services/security-service";
import {httpStatus} from "../enums/httpEnum";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityController {
    constructor(
        @inject(SecurityService) protected securityService: SecurityService
    ) {
    }
    public async getAllSessions({tokenMetaDates}: Request,res: Response){
        const data = await this.securityService.getAllSessionsByToken(tokenMetaDates.userId)
        if(!data) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok).json(data)
    }

    public async killOthersSessions(req: Request, res: Response) {
        const {tokenMetaDates: {deviceId, userId}} = req
        res.sendStatus(
            await this.securityService.killAllForUser({deviceId,userId}) ? httpStatus.noContent : httpStatus.teapot
        )
    }

    public async killSession(req: Request, res: Response) {
        const {tokenMetaDates,params:{deviceId}} = req
        const isKilled = await this.securityService.killSession(tokenMetaDates,deviceId)
        res.sendStatus(isKilled ? httpStatus.noContent : httpStatus.forbidden)
    }
}