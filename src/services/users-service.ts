import {inject, injectable} from "inversify"
import {GetOutput} from "../models/ResponseModel"
import {UsersFilters} from "../models/filtersModel"
import {QueryRepository} from "../repositories/queryRepository"
import {
    Confirmation,
    Recovery,
    UserInputModel,
    UserInputModelFromFront,
    UserLogicModel,
    UserViewModel
} from "../models/userModel"
import {CommandRepository} from "../repositories/commandRepository"
import {MailWorker} from "../repositories/mailWorker"
import {
    AddFunction,
    HashFunction,
    IdCreatorFunction,
    IsAfterFunction,
    Nullable,
    SaltFunction
} from "../models/mixedModels";


@injectable()
export class UsersService {
    constructor(
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
        @inject(MailWorker) protected mailWorker: MailWorker,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction,
        @inject<Function>("UniqueCode") protected uniqueCode: (param?: any)=> string,
        @inject<HashFunction>('HashFunction') protected hash: HashFunction,
        @inject<Function>('SaltFunction') protected genSalt: SaltFunction,
        @inject<AddFunction>("AddFunction") protected add: AddFunction,
        @inject<IsAfterFunction>("IsAfterFunction") protected isAfter: IsAfterFunction

    ) {}

    public async getUsers(params: UsersFilters): Promise<GetOutput> {
        const searchConfig = {
            filter: {
                $or: [
                    {login: new RegExp(params.searchLoginTerm!, 'ig')},
                    {email: new RegExp(params.searchEmailTerm!, 'ig')}
                ]
            },
            sortDirection: params.sortDirection,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            limit: params.pageSize,
            sortBy: params.sortBy
        }
        const totalCount: number = await this.queryRepository.getUsersCount(searchConfig.filter)
        const items: UserViewModel[] = await this.queryRepository.getUsers(searchConfig) ?? []
        return {
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            totalCount,
            items
        }
    }

    public async adminCreatingUser(input: UserInputModel): Promise<UserViewModel | null> {
        const {password, email, login} = input
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await this.genSalt(10)
        const hash = await this.hash(password, salt)
        const id = this.generateId("user")
        const confirmation = await this.generateConfirmData(true)
        const recovery = await this.generateRecovery(true)
        confirmation.isConfirmed = true
        const user: UserLogicModel = {
            login, email, id,
            hash, createdAt, salt, confirmation, recovery
        }
        await this.commandRepository.createUser(user)
        return await this.queryRepository.getUserById(id)
    }

    public async createUser(input: UserInputModelFromFront): Promise<boolean> {
        const {password, email, login} = input
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await this.genSalt(10)
        const hash = await this.hash(password, salt)
        const id = this.generateId("user")
        const confirmation = await this.generateConfirmData(false)
        const recovery = await this.generateRecovery(true)
        const user: UserLogicModel = {
            login, email, hash, createdAt,
            salt, id, confirmation, recovery
        }
        const isUserCreated: boolean = await this.commandRepository.createUser(user)
        if (!isUserCreated) {
            return false
        }
        const isMailSent: boolean = await this.mailWorker.sendConfirmationAfterRegistration(email, confirmation.code, input.customDomain)
        if (!isMailSent) {
            await this.commandRepository.deleteUser(id)
        }
        return isMailSent
    }

    public async deleteUser(id: string): Promise<boolean> {
        return await this.commandRepository.deleteUser(id)
    }

    public async getUserById(id: string): Promise<UserLogicModel | null> {
        return this.queryRepository.getUserByIdWithLogic(id)
    }

    private async generateConfirmData(isConfirmed: boolean = false): Promise<Confirmation> {
        return {
            code: this.uniqueCode(),
            isConfirmed,
            confirmationDate: this.add(new Date(), {minutes: 15})
        }
    }

    public async confirm(code: string): Promise<boolean> {
        const user = await this.queryRepository.getUserByConfirm(code)
        if (!user) return false
        if (user.confirmation!.isConfirmed) return false
        const isDataExpired = this.isAfter(new Date(Date.now()), user.confirmation!.confirmationDate)
        if (isDataExpired) return false
        return await this.commandRepository.confirmUser(user.id)
    }

    public async resend(email: string, customDomain: Nullable<string> = null): Promise<boolean> {
        const user = await this.queryRepository.getUserByEmail(email)
        const confirmation = await this.generateConfirmData()
        const mailSent = await this.mailWorker.sendConfirmationAfterRegistration(email, confirmation.code, customDomain)
        if (!mailSent) return false
        return await this.commandRepository.changeConfirm(user!.id, confirmation)
    }

    private async generateRecovery(isNewUser: boolean = false): Promise<Recovery> {
        return {
            recoveryCode: isNewUser ? '' : this.uniqueCode(),
            expirationDate: this.add(new Date(), {minutes: 10})
        }
    }

    public async recoverPassword(email: string, customDomain: Nullable<string> = null): Promise<void> {
        const recovery = await this.generateRecovery()
        const user = await this.queryRepository.getUserByEmail(email)
        if(!user) return
        await this.commandRepository.recoverAttempt(email, recovery)
        await this.mailWorker.changePassword(user.email,recovery.recoveryCode, customDomain)
    }

    public async confirmRecovery(recoveryCode: string, newPassword: string): Promise<boolean> {
        const user = await this.queryRepository.getUserByRecoveryCode(recoveryCode)
        if (!user || !user.confirmation.isConfirmed) return false
        if (this.isAfter(Date.now(),user.recovery.expirationDate)){
            return false
        }
        const salt = await this.genSalt(10)
        const hash = await this.hash(newPassword, salt)
        await this.commandRepository.changeUserPassword(user.id,hash,salt)
        await this.commandRepository.setDefaultRecoveryCode(user.id)
        return true
    }
}