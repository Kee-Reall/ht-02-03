import {QueryRepository} from "../repositories/queryRepository";
import {hash as toHash} from "bcrypt";
import {userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import {UsersService} from "./users-service";
import {JwtService} from "./jwt-service";
import {clientMeta} from "../models/mixedModels";
import {refreshTokenPayload, sessionFilter} from "../models/refreshTokensMeta";
import {CommandRepository} from "../repositories/commandRepository";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {

    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository
    ) {
    }

    async login(loginOrEmail: string, password: string): Promise< userLogicModel | null> {
        const user: userLogicModel | null = await this.queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        }
        const {hash, salt} = user
        return  await toHash(password, salt) === hash ? user : null
    }

    async getUser(userId: string): Promise<userViewModel| null> { // no usage
        return await this.usersService.getUserById(userId)
    }

    async registration (input: userInputModel) {
        return await this.usersService.createUser(input)
    }

    async conformation (code: string): Promise<boolean> {
        return await this.usersService.confirm(code)
    }

    async resendEmail(email: string) {
        return await this.usersService.resend(email)
    }

    async refresh(meta: clientMeta) {
        return await this.jwtService.updateTokenPair(meta)
    }

    async logout(tokensInfo: refreshTokenPayload): Promise<boolean> {
        const {updateDate, userId, deviceId} = tokensInfo
        const filter: sessionFilter = {userId,deviceId}
        const sessionData = await this.queryRepository.getMetaToken(filter)
        if(!sessionData || updateDate !== sessionData.updateDate.toISOString()) {
            return false
        }
        return await this.commandRepository.killMetaToken(filter)
    }
}