import {queryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import {usersService} from "./users-service";

class AuthService {

    async login(loginOrEmail: string, password: string): Promise< userLogicModel | null> {
        const user: userLogicModel | null = await queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if (user === null) {
            return user
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

    async refresh(userId: string, refreshToken: string) {
        return await usersService.refresh(userId,refreshToken)
    }
}

export const authService = new AuthService()