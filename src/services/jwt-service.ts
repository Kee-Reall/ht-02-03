import jwt, {SignOptions} from 'jsonwebtoken'
import {userViewModel} from "../models/userModel";
import {usersService} from "./users-service";

class JwtService {

    private readonly normalTimeExpire: number = 3

    private getJwtSecret(): string {
        return process.env.JWT_SECRET as string
    }

    private generateExpire(time: number = this.normalTimeExpire): SignOptions {
        return {
            expiresIn: `${time}h`
        }
    }

    public async createToken(userId: string): Promise<string> {
        return jwt.sign({userId}, this.getJwtSecret(), this.generateExpire());
    }

    private async verify(token: string): Promise<string | null> {
        try {
            const res: any = jwt.verify(token, this.getJwtSecret())
            return res.userId
        } catch (e) {
            return null
        }
    }

    async getUserByToken(token: string): Promise< userViewModel | null> {
        const result: string | null = await this.verify(token)
        if(result !== null) {
            return await usersService.getUserById(result)
        } else {
            return null
        }
    }
}

export const  jwtService = new JwtService()