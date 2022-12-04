import {blogViewModel} from "./blogModel";

export interface blogSearchModel {
    searchNameTerm: string
    sortBy: keyof blogViewModel
    sortDirection: 1 | -1
}