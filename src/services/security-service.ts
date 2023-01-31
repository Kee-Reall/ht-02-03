import {securityViewModel} from "../models/SecurityModel";
import {refreshTokenPayload} from "../models/refreshTokensMeta";
import {jwtService} from "./jwt-service";
import {queryRepository} from "../repositories/queryRepository";

class SecurityService {
    public async getAllSessionsByToken(token: string): Promise< Array<securityViewModel> | null> {
        const payload: refreshTokenPayload = await jwtService.verifyRefreshToken(token) as refreshTokenPayload
        if(!payload) {
            return null
        }
        return await queryRepository.getTokensForUser(payload.userId)
    }
}

export const securityService = new SecurityService()