import {inject, injectable} from "inversify";
import {QueryRepository} from "../repositories/queryRepository";
import {UserInputModel, UserLogicModel, UserViewModel} from "../models/userModel";
import {UsersService} from "./users-service";
import {JwtService} from "./jwt-service";
import {ClientMeta, HashFunction} from "../models/mixedModels";
import {RefreshTokenPayload, SessionFilter} from "../models/refreshTokensMeta";
import {CommandRepository} from "../repositories/commandRepository";

@injectable()
export class AuthService {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
        @inject<HashFunction>("HashFunction") protected hash: HashFunction
    ) {
    }

    async login(loginOrEmail: string, password: string): Promise< UserLogicModel | null> {
        const user: UserLogicModel | null = await this.queryRepository.getUserByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        }
        const {hash, salt} = user
        return  await this.hash(password, salt) === hash ? user : null
    }

    async getUser(userId: string): Promise<UserViewModel| null> { // no usage
        return await this.usersService.getUserById(userId)
    }

    async registration (input: UserInputModel) {
        return await this.usersService.createUser(input)
    }

    async conformation (code: string): Promise<boolean> {
        return await this.usersService.confirm(code)
    }

    async resendEmail(email: string) {
        return await this.usersService.resend(email)
    }

    async refresh(meta: ClientMeta) {
        return await this.jwtService.updateTokenPair(meta)
    }

    async logout(tokensInfo: RefreshTokenPayload): Promise<boolean> {
        const {updateDate, userId, deviceId} = tokensInfo
        const filter: SessionFilter = {userId,deviceId}
        const sessionData = await this.queryRepository.getMetaToken(filter)
        if(!sessionData || updateDate !== sessionData.updateDate.toISOString()) {
            return false
        }
        return await this.commandRepository.killMetaToken(filter)
    }
}