import {getOutput} from "../models/ResponseModel";
import {usersFilters} from "../models/filtersModel";
import {queryRepository} from "../repositories/queryRepository";
import {userInputModel, userLogicModel, userViewModel} from "../models/userModel";
import bcrypt from 'bcrypt'
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";

class UsersService {
    async getUsers(params: usersFilters): Promise<getOutput> {

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


    async createUser(input: userInputModel): Promise<userViewModel | null> {
        const createdAt: string = new Date(Date.now()).toISOString()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(input.password,salt)
        const id = generateId("user")
        const user: userLogicModel = {
            login: input.login,
            email: input.email,
            hash, createdAt, salt, id
        }
        const result = await commandRepository.createUser(user)
        if(result) {
            return await queryRepository.getUserById(id)
        }
        return null
    }

    async deleteUser(id:string): Promise<boolean> {
        return await commandRepository.deleteUser(id)
   }

   async getUserById(id: string): Promise<userViewModel | null> {
        return queryRepository.getUserById(id)
   }

}

export const usersService = new UsersService()