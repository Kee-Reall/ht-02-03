import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken'
import {userLogicModel} from "../models/userModel";
import {usersService} from "./users-service";
import {clientMeta, createTokenClientMeta, tokenPair} from "../models/mixedModels";
import {commandRepository} from "../repositories/commandRepository";
import {queryRepository} from "../repositories/queryRepository";
import {refreshTokenPayload} from "../models/refreshTokensMeta";

class JwtService {

    private readonly normalTimeExpire: number = 10

    private getJwtSecret(): string {
        return process.env.JWT_SECRET as string
    }

    private convertDayToSec(day: number): number { // convert day into ms
        const [secPerMin, MinPerHour, HourPerDay] = [ 60 , 60 , 24]
        return day * secPerMin * MinPerHour * HourPerDay
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

    private async createNewRefreshToken(clientInfo: createTokenClientMeta): Promise<string | null>{
        const metaDataAfterCreation = await commandRepository.createMetaToken(clientInfo)
        if(!metaDataAfterCreation) {
            return null
        }
        const payload: refreshTokenPayload = {
            userId: clientInfo.userId,
            deviceId: metaDataAfterCreation.deviceId,
            updateDate: metaDataAfterCreation.updateDate.toISOString(),
        }
        return jwt.sign(payload, this.getJwtSecret(),this.generateExpireIn15Days())
    }

    private async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign({userId}, this.getJwtSecret(), this.generateExpire(
            this.convertDayToSec(3)
        ));
    }

    public async createNewTokenPair(clientInfo: createTokenClientMeta): Promise<tokenPair | null> {
        const refreshToken = await this.createNewRefreshToken(clientInfo)
        if(!refreshToken) {
            return null
        }
        const accessToken = await this.createAccessToken(clientInfo.userId)
        return { accessToken, refreshToken }
    }

    public async updateTokenPair(clientInfo: clientMeta): Promise<tokenPair | null> {
        const {deviceId,updateDate,userId,ip} = clientInfo
        const refreshToken = await this.updateRefreshToken({deviceId,updateDate,userId},ip as string)
        if(!refreshToken) {
            return null
        }
        const accessToken = await this.createAccessToken(clientInfo.userId)
        return { accessToken, refreshToken }
    }

    private async updateRefreshToken(tokenMeta: refreshTokenPayload,ip: string): Promise<string | null> {
        const{ updateDate, userId, deviceId} = tokenMeta
        const dbToken = await queryRepository.getMetaToken(tokenMeta)
        if(!dbToken || ( dbToken.updateDate.toISOString() !== updateDate)){
            return null
        }
        const metaDataAfterUpdate = await commandRepository.updateMetaToken({userId, deviceId, ip})
        if(!metaDataAfterUpdate) {
            return null
        }
        return jwt.sign(metaDataAfterUpdate,this.getJwtSecret(),this.generateExpireIn15Days())
    }

    public async createTokenPair(userId: string,current: string): Promise<tokenPair | null> { //deprecated
        const nextRefreshToken = await this.createRefreshToken(userId)
        const tokensUpdated = await commandRepository.changeCurrentToken({
            id: userId,
            previousToken: current,
            nextToken: nextRefreshToken
        })
        if(!tokensUpdated) return null
        return {
            accessToken: await this.createAccessToken(userId),
            refreshToken: nextRefreshToken
        }
    }

    private async _verify(token: string): Promise<string | null> {
        try {
            const payload: any = jwt.verify(token, this.getJwtSecret())
            return payload.userId as string
        } catch (e) {
            return null
        }
    }

    public async verify(token: string): Promise<boolean> {
        try {
            const isVerified = jwt.verify(token,this.getJwtSecret())
            return !!isVerified
        } catch (e) {
            return false
        }
    }
    public async getUserByToken(token: string): Promise< userLogicModel | null> {
        const userId: string | null = await this._verify(token)
        return userId ? await usersService.getUserById(userId) : userId as null
    }

    public async verifyRefreshToken(token: string): Promise<refreshTokenPayload | null> {
        try {
            return  jwt.verify(token,this.getJwtSecret()) as refreshTokenPayload
        } catch (e) {
            return null
        }
    }

    public async getPayload(token: string): Promise<JwtPayload> { //deprecated
        return jwt.decode(token) as JwtPayload;
    }
}

export const  jwtService = new JwtService()