import {blogFilters} from "../models/filtersModel";
import {normalizeSortDirection} from "./normalizeSortDirection";

export function normalizeBlogsQuery(query: blogFilters):blogFilters {
    const sortDirection = normalizeSortDirection(query.sortDirection)
    return {
        searchNameTerm: query.searchNameTerm ?? '[*]*',
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection
    }
}