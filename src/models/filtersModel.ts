import {blogViewModel} from "./blogModel";
import { CommentsViewModel } from "./commentsModel";
import {userViewModel} from "./userModel";

interface abstractFilter<T> {
    pageNumber?: number
    pageSize?: number
    sortBy?: keyof T
    sortDirection: 'asc' | 'desc'
}

export interface blogFilters extends abstractFilter<blogViewModel> {
    searchNameTerm?:string
}

export interface usersFilters extends abstractFilter<userViewModel> {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export interface commentsFilter extends abstractFilter<CommentsViewModel> {
 //write some here
}