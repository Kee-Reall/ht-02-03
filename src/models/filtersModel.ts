import {BlogViewModel} from "./blogModel";
import { CommentsViewModel } from "./commentsModel";
import {UserViewModel} from "./userModel";

interface AbstractFilter<T> {
    pageNumber?: number
    pageSize?: number
    sortBy?: keyof T
    sortDirection?: 'asc' | 'desc'
}

export interface BlogFilters extends AbstractFilter<BlogViewModel> {
    searchNameTerm?:string
}

export interface UsersFilters extends AbstractFilter<UserViewModel> {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export interface CommentsFilter extends AbstractFilter<CommentsViewModel> {
    searchId?:string
}