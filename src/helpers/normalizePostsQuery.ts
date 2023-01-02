import {blogFilters} from "../models/filtersModel";

export function normalizePostsQuery(query: blogFilters):blogFilters {
    const directions: string[] = ['asc','desc']
    let sortDirection: 'desc' | 'asc' = 'desc'
    if(directions.includes(query.sortDirection as string)){
        sortDirection = query.sortDirection!
    }
    return {
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection
    }
}