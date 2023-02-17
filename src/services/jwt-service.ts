import jwt, {SignOptions} from 'jsonwebtoken'
import {UserLogicModel} from "../models/userModel";
import {UsersService} from "./users-service";
import {ClientMeta, CreateTokenClientMeta, NullablePromise, TokenPair} from "../models/mixedModels";
import {CommandRepository} from "../repositories/commandRepository";
import {QueryRepository} from "../repositories/queryRepository";
import {RefreshTokenPayload} from "../models/refreshTokensMeta";
import {inject, injectable} from "inversify";

@injectable()
export class JwtService {

    constructor(
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
        @inject(UsersService) protected usersService: UsersService
    ) {}

    private readonly normalTimeExpire: number = 10

    private getJwtSecret(): string {
        return process.env.JWT_SECRET as string
    }

    private generateExpire(time: number = this.normalTimeExpire): SignOptions {
        return {
            expiresIn: `${time}s`
        }
    }

    private generateExpireIn15Days(): SignOptions {
        return {
            expiresIn: `15d`
        }
    }

    public async createAccessToken(userId: string): Promise<string> {
        return jwt.sign({userId}, this.getJwtSecret(), this.generateExpire(10 * 60));
    }

    private async createRefreshToken(clientInfo: CreateTokenClientMeta): NullablePromise<string>{
        const metaDataAfterCreation = await this.commandRepository.createMetaToken(clientInfo)
        if(!metaDataAfterCreation) {
            return null
        }
        const payload: RefreshTokenPayload = {
            userId: clientInfo.userId,
            deviceId: metaDataAfterCreation.deviceId,
            updateDate: metaDataAfterCreation.updateDate.toISOString(),
        }
        return jwt.sign(payload, this.getJwtSecret(),this.generateExpireIn15Days())
    }

    public async createTokenPair(clientInfo: CreateTokenClientMeta): NullablePromise<TokenPair> {
        const refreshToken = await this.createRefreshToken(clientInfo)
        if(!refreshToken) {
            return null
        }
        const accessToken = await this.createAccessToken(clientInfo.userId)
        return { accessToken, refreshToken }
    }

    public async updateTokenPair(clientInfo: ClientMeta): NullablePromise<TokenPair> {
        const {deviceId,updateDate,userId,ip} = clientInfo
        const refreshToken = await this.updateRefreshToken({deviceId,updateDate,userId},ip as string)
        if(!refreshToken) {
            return null
        }
        const accessToken = await this.createAccessToken(clientInfo.userId)
        return { accessToken, refreshToken }
    }

    private async updateRefreshToken(tokenMeta: RefreshTokenPayload, ip: string): NullablePromise<string> {
        const{ updateDate, userId, deviceId} = tokenMeta
        const dbToken = await this.queryRepository.getMetaToken(tokenMeta)
        if(!dbToken || ( dbToken.updateDate.toISOString() !== updateDate)){
            return null
        }
        const metaDataAfterUpdate = await this.commandRepository.updateMetaToken({userId, deviceId, ip})
        if(!metaDataAfterUpdate) {
            return null
        }
        return jwt.sign(metaDataAfterUpdate,this.getJwtSecret(),this.generateExpireIn15Days())
    }


    private async _verify(token: string): NullablePromise<string> {
        try {
            const payload: any = jwt.verify(token, this.getJwtSecret())
            return payload.userId as string
        } catch (e) {
            return null
        }
    }

    public async getUserByToken(token: string): NullablePromise<UserLogicModel> {
        const userId: string | null = await this._verify(token)
        return userId ? await this.usersService.getUserById(userId) : userId as null
    }

    public async verifyRefreshToken(token: string): NullablePromise<RefreshTokenPayload> {
        try {
            return  jwt.verify(token,this.getJwtSecret()) as RefreshTokenPayload
        } catch (e) {
            return null
        }
    }

}