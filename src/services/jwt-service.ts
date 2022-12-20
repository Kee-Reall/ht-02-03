import jwt, {SignOptions} from 'jsonwebtoken'

class JwtService {

    private readonly normalTimeExpire: number = 3

    getJwtSecret(): string {
        return process.env.JWT_SECRET as string
    }

    generateExpire(time: number = this.normalTimeExpire): SignOptions {
        return {
            expiresIn: `${time}h`
        }
    }

    async createToken(userId: string) {
        return jwt.sign({userId: userId}, this.getJwtSecret(), this.generateExpire());
    }
}

export const  jwtService = new JwtService()