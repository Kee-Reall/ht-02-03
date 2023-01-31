import {securityViewModel} from "../models/SecurityModel";
import {jwtService} from "./jwt-service";
import {queryRepository} from "../repositories/queryRepository";

class SecurityService {
    public async getAllSessionsByToken(token: string): Promise< Array<securityViewModel> | null> {
        const payload = await jwtService.verifyRefreshToken(token)
        return payload ? await queryRepository.getTokensForUser(payload.userId) : null
    }
}

export const securityService = new SecurityService()