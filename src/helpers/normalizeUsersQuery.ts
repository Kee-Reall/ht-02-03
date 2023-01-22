import {usersFilters} from "../models/filtersModel";
import {normalizeSortDirection} from "./normalizeSortDirection";

export function normalizeUsersQuery(query: usersFilters):usersFilters {
    const sortDirection = normalizeSortDirection(query.sortDirection)
    return  {
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy || 'createdAt',
        sortDirection,
        searchLoginTerm: query.searchLoginTerm || '[*]*',
        searchEmailTerm: query.searchEmailTerm || '[*]*'
    }
}