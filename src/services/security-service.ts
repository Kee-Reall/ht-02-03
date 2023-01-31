import {securityViewModel} from "../models/SecurityModel";
import {queryRepository} from "../repositories/queryRepository";
import {refreshTokenPayload} from "../models/refreshTokensMeta";
import {commandRepository} from "../repositories/commandRepository";

class SecurityService {
    public async getAllSessionsByToken(userId: string): Promise< Array<securityViewModel> | null> {
        return await queryRepository.getTokensForUser(userId)
    }

    public async killSession(meta: refreshTokenPayload,deviceId: string): Promise<boolean> {
        const metaToken = await queryRepository.getMetaToken({userId: meta.userId, deviceId: deviceId})
        if(!metaToken) {
            return false
        }
        return await commandRepository.killMetaToken({deviceId: deviceId,userId: metaToken.userId})
    }
}

export const securityService = new SecurityService()