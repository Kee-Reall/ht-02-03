import {SecurityViewModel} from "../models/SecurityModel";
import {QueryRepository} from "../repositories/queryRepository";
import {RefreshTokenPayload, SessionFilter} from "../models/refreshTokensMeta";
import {CommandRepository} from "../repositories/commandRepository";
import {inject, injectable} from "inversify";
import {NullablePromise} from "../models/mixedModels";

@injectable()
export class SecurityService {

    constructor(
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
    ) {
    }
    public async getAllSessionsByToken(userId: string): NullablePromise<Array<SecurityViewModel>> {
        return await this.queryRepository.getTokensForUser(userId)
    }

    public async killSession(meta: RefreshTokenPayload, deviceId: string): Promise<boolean> {
        const metaToken = await this.queryRepository.getMetaToken({userId: meta.userId, deviceId: deviceId})
        if(!metaToken) {
            return false
        }
        return await this.commandRepository.killMetaToken({deviceId: deviceId,userId: metaToken.userId})
    }

    public async killAllForUser({deviceId, userId}: SessionFilter) {
        return await this.commandRepository.killSessionsForUser(userId,deviceId)
    }
}