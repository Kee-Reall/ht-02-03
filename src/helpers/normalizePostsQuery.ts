import {blogFilters} from "../models/filtersModel";
import {normalizeSortDirection} from "./normalizeSortDirection";

export function normalizePostsQuery(query: blogFilters):blogFilters {
    const sortDirection = normalizeSortDirection(query.sortDirection)
    return {
        pageNumber: +query.pageNumber! || 1,
        pageSize: +query.pageSize! || 10,
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection
    }
}