import {usersFilters} from "../models/filtersModel";

export function normalizeUsersQuery(query: usersFilters):usersFilters {
    const directions: string[] = ['asc','desc']
    let sortDirection: 'desc' | 'asc' = 'desc'
    if(directions.includes(query.sortDirection as string)) {
        sortDirection = query.sortDirection!
    }
    const filter = {
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy || 'createdAt',
        sortDirection,
        searchLoginTerm: query.searchLoginTerm || '[*]*',
        searchEmailTerm: query.searchEmailTerm || '[*]*'
    }
    return filter
}