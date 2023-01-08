import {getOutput} from "../models/ResponseModel";
import {usersFilters} from "../models/filtersModel";
import {queryRepository} from "../repositories/queryRepository";
import {userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import bcrypt from "bcrypt"
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {v4 as uniqueCode} from "uuid"
import add from "date-fns/add"
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
        const confirmation = this.generateConfirmData(true)
        confirmation.isConfirmed = true
        const user: userLogicModel = {
            login, email, id,
            hash, createdAt, salt, confirmation
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
        const confirmation = this.generateConfirmData(false)
        const user: userLogicModel = {login, email, hash, createdAt, salt, id, confirmation}
        const result = await commandRepository.createUser(user)
        if(!result) {
            return false
        }
        const mailResult: boolean = await mailWorker.sendConfirmationAfterRegistration(email,confirmation.code)
        return true
    }

    public async deleteUser(id:string): Promise<boolean> {
        return await commandRepository.deleteUser(id)
   }

   public async getUserById(id: string): Promise<userViewModel | null> {
        return queryRepository.getUserById(id)
   }

   private generateConfirmData(isConfirmed: boolean = false) {
        return {
            code: isConfirmed ? null : uniqueCode(),
            isConfirmed,
            confirmationDate: add(new Date(),{minutes: 15})
        }
   }

}

export const usersService = new UsersService()