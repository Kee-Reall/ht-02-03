import {queryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userLogicModel, userViewModel} from "../models/userModel";
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

    async getUser(userId: string): Promise<userViewModel| null> {
        return await usersService.getUserById(userId)
    }
}

export const authService = new AuthService()