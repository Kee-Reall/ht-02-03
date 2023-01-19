import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken'
import {userLogicModel, userTokensData, userViewModel} from "../models/userModel";
import {usersService} from "./users-service";
import {tokenPair} from "../models/mixedModels";
import {commandRepository} from "../repositories/commandRepository";

class JwtService {

    private readonly normalTimeExpire: number = 10

    private getJwtSecret(): string {
        return process.env.JWT_SECRET as string
    }

    private generateExpire(time: number = this.normalTimeExpire): SignOptions {
        return {
            expiresIn: `${time}s`
        }
    }

    public async createAccessToken(userId: string): Promise<string> {
        return jwt.sign({userId}, this.getJwtSecret(), this.generateExpire());
    }

    private async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign({userId}, this.getJwtSecret(), this.generateExpire(20));
    }

    public async createTokenPair(userId: string,current: string): Promise<tokenPair | null> {
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

    public async getPayload(token: string): Promise<JwtPayload> {
        return jwt.decode(token) as JwtPayload;
    }
}

export const  jwtService = new JwtService()