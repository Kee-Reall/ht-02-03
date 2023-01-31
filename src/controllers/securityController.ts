import {Request, Response} from "express";
import {securityService} from "../services/security-service";
import {httpStatus} from "../enums/httpEnum";
class SecurityController {
    public async getAllSessions(req: Request,res: Response){
        const { cookies: { refreshToken }} = req
        const data = securityService.getAllSessionsByToken(refreshToken)
        if(!data) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok).json(data)
    }
}

export const securityController = new SecurityController()