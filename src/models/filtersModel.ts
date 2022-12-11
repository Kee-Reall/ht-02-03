import {blogViewModel} from "./blogModel";
import {userViewModel} from "./userModel";

export type blogFilters = {
    searchNameTerm?:string
    pageNumber?: number
    pageSize?: number
    sortBy?: keyof blogViewModel,
    sortDirection?: 'asc' | 'desc'
}

export type usersFilters = {
    pageNumber?: number
    pageSize?: number
    sortBy?: keyof userViewModel
    sortDirection?: 'asc' | 'desc'
    searchLoginTerm?: string
    searchEmailTerm?: string
}