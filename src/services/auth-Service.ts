import {queryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userLogicModel} from "../models/userModel";

class AuthService {

    async login(loginOrEmail: string, password: string): Promise< userLogicModel | null> {
        const user: userLogicModel | null = await queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if (user === null) {
            return user
        }
        const {hash, salt} = user
        return  await toHash(password, salt) === hash ? user : null
    }
}

export const authService = new AuthService()