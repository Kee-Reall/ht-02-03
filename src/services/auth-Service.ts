import {queryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import {usersService} from "./users-service";
import {jwtService} from "./jwt-service";
import {clientMeta} from "../models/mixedModels";
import {refreshTokenPayload, sessionFilter} from "../models/refreshTokensMeta";
import {commandRepository} from "../repositories/commandRepository";

class AuthService {

    async login(loginOrEmail: string, password: string): Promise< userLogicModel | null> {
        const user: userLogicModel | null = await queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        }
        const {hash, salt} = user
        return  await toHash(password, salt) === hash ? user : null
    }

    async getUser(userId: string): Promise<userViewModel| null> { // no usage
        return await usersService.getUserById(userId)
    }

    async registration (input: userInputModel) {
        return await usersService.createUser(input)
    }

    async conformation (code: string): Promise<boolean> {
        return await usersService.confirm(code)
    }

    async resendEmail(email: string) {
        return await usersService.resend(email)
    }

    async refresh(meta: clientMeta) {
        return await jwtService.updateTokenPair(meta)
    }

    async logout(tokensInfo: refreshTokenPayload): Promise<boolean> {
        const {updateDate, userId, deviceId} = tokensInfo
        const filter: sessionFilter = {userId,deviceId}
        const sessionData = await queryRepository.getMetaToken(filter)
        if(!sessionData || updateDate !== sessionData.updateDate.toISOString()) {
            return false
        }
        return await commandRepository.killMetaToken(filter)
    }
}

export const authService = new AuthService()