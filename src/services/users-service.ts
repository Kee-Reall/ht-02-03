import {getOutput} from "../models/ResponseModel";
import {usersFilters} from "../models/filtersModel";
import {queryRepository} from "../repositories/queryRepository";
import {userViewModel} from "../models/userModel";

class UsersService {
    async getUsers(params: usersFilters): Promise<getOutput> {

        const searchConfig = {
            filter: {
                $and: [
                    {login: new RegExp(params.searchLoginTerm!,'i')},
                    {email: new RegExp(params.searchEmailTerm!,'i')}
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

}

export const usersService = new UsersService()