import {blogViewModel} from "./blogModel";

export type blogFilters = {
    searchNameTerm?:string
    pageNumber?: number
    pageSize?: number
    sortBy?: keyof blogViewModel,
    sortDirection?: 'asc' | 'desc'
}