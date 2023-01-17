import jwt, {SignOptions} from 'jsonwebtoken'
import {userTokensData, userViewModel} from "../models/userModel";
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

    public async createTokenPair(userId: string,userTokensData: userTokensData): Promise<tokenPair | null> {
        const nextRefreshToken = await this.createRefreshToken(userId)
        const tokensUpdated = await commandRepository.changeCurrentToken({
            id: userId,
            previousToken: userTokensData.current,
            nextToken: nextRefreshToken
        })
        if(!tokensUpdated) return null
        return {
            accessToken: await this.createAccessToken(userId),
            refreshToken: nextRefreshToken
        }
    }

    private async verify(token: string): Promise<string | null> {
        try {
            const payload: any = jwt.verify(token, this.getJwtSecret())
            return payload.userId as string
        } catch (e) {
            return null
        }
    }
    public async getUserByToken(token: string): Promise< userViewModel | null> {
        const userId: string | null = await this.verify(token)
        return userId ? await usersService.getUserById(userId) : userId as null
    }
}

export const  jwtService = new JwtService()