import {blogFilters} from "../models/blogModel";

export function normalizeBlogsQuery(query: blogFilters):blogFilters {
    const directions: any[] = ['asc','desc']
    let sortDirection: 'desc' | 'asc' = 'desc'
    if(directions.includes(query.sortDirection)){
        sortDirection = query.sortDirection!
    }
    return {
        searchNameTerm: query.searchNameTerm ?? '',
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection
    }
}