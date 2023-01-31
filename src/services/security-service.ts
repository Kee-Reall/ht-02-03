import {securityViewModel} from "../models/SecurityModel";
import {queryRepository} from "../repositories/queryRepository";
import {refreshTokenPayload, sessionFilter} from "../models/refreshTokensMeta";
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

    public async killAllForUser({deviceId, userId}: sessionFilter) {
        return await commandRepository.killSessionsForUser(userId,deviceId)
    }
}

export const securityService = new SecurityService()