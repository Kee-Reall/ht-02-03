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