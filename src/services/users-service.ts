import {getOutput} from "../models/ResponseModel";
import {usersFilters} from "../models/filtersModel";
import {queryRepository} from "../repositories/queryRepository";
import {confirmation, userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import bcrypt from "bcrypt"
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {v4 as uniqueCode} from "uuid"
import {add, isAfter} from "date-fns"
import {mailWorker} from "../repositories/mailWorker";

class UsersService {
    public async getUsers(params: usersFilters): Promise<getOutput> {

        const searchConfig = {
            filter: {
                $or: [
                    {login: new RegExp(params.searchLoginTerm!,'ig')},
                    {email: new RegExp(params.searchEmailTerm!,'ig')}
                ]
            },
            sortDirection: params.sortDirection,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            limit: params.pageSize,
            sortBy: params.sortBy
        }
        const totalCount: number = await queryRepository.getUsersCount(searchConfig.filter)
        const items: userViewModel[] = await queryRepository.getUsers(searchConfig) ?? []

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
        const hash = await bcrypt.hash(password,salt)
        const id = generateId("user")
        const confirmation = await this.generateConfirmData(true)
        confirmation.isConfirmed = true
        const user: userLogicModel = {
            login, email, id,
            hash, createdAt, salt, confirmation,
            refreshTokens:{current:'', expired:[]}
        }
        const result = await commandRepository.createUser(user)
        if(result) {
            return await queryRepository.getUserById(id)
        }
        return null
    }

    public async createUser(input: userInputModel): Promise<boolean> {
        const {password, email, login} = input
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        const id = generateId("user")
        const confirmation = await this.generateConfirmData(false)
        const user: userLogicModel = {
            login, email, hash, createdAt,
            salt, id, confirmation,
            refreshTokens: {current:'', expired:[]}
        }
        const isUserCreated: boolean = await commandRepository.createUser(user)
        if(!isUserCreated) {
            return false
        }
        const isMailSent: boolean = await mailWorker.sendConfirmationAfterRegistration(email,confirmation.code)
        if(!isMailSent) {
            await commandRepository.deleteUser(id)
        }
        return isMailSent
    }

    public async deleteUser(id:string): Promise<boolean> {
        return await commandRepository.deleteUser(id)
   }

   public async getUserById(id: string): Promise<userViewModel | null> {
        return queryRepository.getUserById(id)
   }

   private async generateConfirmData(isConfirmed: boolean = false): Promise<confirmation> {
        return {
            code: uniqueCode(),
            isConfirmed,
            confirmationDate: add(new Date(),{minutes: 15})
        }
   }

   public async confirm(code: string): Promise<boolean> {
       const user = await queryRepository.getUserByConfirm(code)
       if(!user) return false
       if(user.confirmation!.isConfirmed) return false
       const isDataExpired = isAfter(new Date(Date.now()), user.confirmation!.confirmationDate)
       if(isDataExpired) return false
       return await commandRepository.confirmUser(user.id)
   }

   public async resend(email: string): Promise<boolean> {
       const user = await queryRepository.getUserByEmail(email)
       const confirmation = await this.generateConfirmData()
       const mailSent = await mailWorker.sendConfirmationAfterRegistration(email,confirmation.code)
       if(!mailSent) return false
       return await commandRepository.changeConfirm(user!.id,confirmation)
   }
}

export const usersService = new UsersService()