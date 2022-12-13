import {queryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userLogicModel} from "../models/userModel";

class AuthService {

    async login(loginOrEmail: string, password: string): Promise<boolean> {
        const user: userLogicModel | null = await queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if (user === null) {
            return false
        }
        const {hash, salt} = user
        return  await toHash(password, salt) === hash
    }
}

export const authService = new AuthService()