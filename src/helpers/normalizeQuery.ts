import {blogFilters} from "../models/blogModel";

export const normalizeQuery = (query: blogFilters):blogFilters => {
    const directions: any[] = ['asc','desc']
    let sortDirection: 'desc' | 'asc' = 'desc'
    if(directions.includes(query.sortDirection)){
        sortDirection = query.sortDirection!
    }
    return {
        searchNameTerms: query.searchNameTerms ?? '',
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection
    }
}