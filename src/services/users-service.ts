import bcrypt from "bcrypt"
import {inject, injectable} from "inversify"
import {v4 as uniqueCode} from "uuid"
import {add, isAfter} from "date-fns"
import {getOutput} from "../models/ResponseModel"
import {usersFilters} from "../models/filtersModel"
import {QueryRepository} from "../repositories/queryRepository"
import {confirmation, recovery, userInputModel, userLogicModel, userViewModel} from "../models/userModel"
import {CommandRepository} from "../repositories/commandRepository"
import generateId from "../helpers/generateId"
import {MailWorker} from "../repositories/mailWorker"


@injectable()
export class UsersService {
    constructor(
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
        @inject(MailWorker) protected mailWorker: MailWorker
) {}

    public async getUsers(params: usersFilters): Promise<getOutput> {
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
        const items: userViewModel[] = await this.queryRepository.getUsers(searchConfig) ?? []
        return {
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            totalCount,
            items
        }
    }

    public async adminCreatingUser(input: userInputModel): Promise<userViewModel | null> {
        const {password, email, login} = input
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const id = generateId("user")
        const confirmation = await this.generateConfirmData(true)
        const recovery = await this.generateRecovery(true)
        confirmation.isConfirmed = true
        const user: userLogicModel = {
            login, email, id,
            hash, createdAt, salt, confirmation, recovery
        }
        await this.commandRepository.createUser(user)
        return await this.queryRepository.getUserById(id)
    }

    public async createUser(input: userInputModel): Promise<boolean> {
        const {password, email, login} = input
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const id = generateId("user")
        const confirmation = await this.generateConfirmData(false)
        const recovery = await this.generateRecovery(true)
        const user: userLogicModel = {
            login, email, hash, createdAt,
            salt, id, confirmation, recovery
        }
        const isUserCreated: boolean = await this.commandRepository.createUser(user)
        if (!isUserCreated) {
            return false
        }
        const isMailSent: boolean = await this.mailWorker.sendConfirmationAfterRegistration(email, confirmation.code)
        if (!isMailSent) {
            await this.commandRepository.deleteUser(id)
        }
        return isMailSent
    }

    public async deleteUser(id: string): Promise<boolean> {
        return await this.commandRepository.deleteUser(id)
    }

    public async getUserById(id: string): Promise<userLogicModel | null> {
        return this.queryRepository.getUserByIdWithLogic(id)
    }

    private async generateConfirmData(isConfirmed: boolean = false): Promise<confirmation> {
        return {
            code: uniqueCode(),
            isConfirmed,
            confirmationDate: add(new Date(), {minutes: 15})
        }
    }

    public async confirm(code: string): Promise<boolean> {
        const user = await this.queryRepository.getUserByConfirm(code)
        if (!user) return false
        if (user.confirmation!.isConfirmed) return false
        const isDataExpired = isAfter(new Date(Date.now()), user.confirmation!.confirmationDate)
        if (isDataExpired) return false
        return await this.commandRepository.confirmUser(user.id)
    }

    public async resend(email: string): Promise<boolean> {
        const user = await this.queryRepository.getUserByEmail(email)
        const confirmation = await this.generateConfirmData()
        const mailSent = await this.mailWorker.sendConfirmationAfterRegistration(email, confirmation.code)
        if (!mailSent) return false
        return await this.commandRepository.changeConfirm(user!.id, confirmation)
    }

    private async generateRecovery(isNewUser: boolean = false): Promise<recovery> {
        return {
            recoveryCode: isNewUser ? '' : uniqueCode(),
            expirationDate: add(new Date(), {minutes: 10})
        }
    }

    public async recoverPassword(email: string): Promise<void> {
        const recovery = await this.generateRecovery()
        const user = await this.queryRepository.getUserByEmail(email)
        if(!user) return
        await this.commandRepository.recoverAttempt(email, recovery)
        await this.mailWorker.changePassword(user.email,recovery.recoveryCode)
    }

    public async confirmRecovery(recoveryCode: string, newPassword: string): Promise<boolean> {
        const user = await this.queryRepository.getUserByRecoveryCode(recoveryCode)
        if (!user || !user.confirmation.isConfirmed) return false
        if (isAfter(Date.now(),user.recovery.expirationDate)){
            return false
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        await this.commandRepository.changeUserPassword(user.id,hash,salt)
        await this.commandRepository.setDefaultRecoveryCode(user.id)
        return true
    }
}