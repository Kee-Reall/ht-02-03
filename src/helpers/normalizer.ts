import {blogFilters, commentsFilter, usersFilters} from "../models/filtersModel";
import {sortingDirection} from "../models/mixedModels";
import {normalizeSortDirection} from "./normalizeSortDirection";
import {injectable} from "inversify";

@injectable()
export class Normalizer {
    public normalizeSortDirection (argument?: any): sortingDirection {
        return argument === 'asc' ? argument : 'desc'
    }
    public normalizeBlogsQuery(query: blogFilters):blogFilters {
            const sortDirection = this.normalizeSortDirection(query.sortDirection)
            return {
                searchNameTerm: query.searchNameTerm ?? '[*]*',
                pageNumber: +query.pageNumber! || 1,
                pageSize: +query.pageSize! || 10,
                sortBy: query.sortBy ?? 'createdAt',
                sortDirection
            }
    }
    public normalizeCommentQuery(query: commentsFilter):commentsFilter {
        const sortDirection = normalizeSortDirection(query.sortDirection)
        return {
            pageNumber: +query.pageNumber! || 1,
            pageSize: +query.pageSize! || 10,
            sortBy: query.sortBy ?? 'createdAt',
            sortDirection
        }
    }
    public normalizePostsQuery(query: blogFilters):blogFilters {
        const sortDirection = normalizeSortDirection(query.sortDirection)
        return {
            pageNumber: +query.pageNumber! || 1,
            pageSize: +query.pageSize! || 10,
            sortBy: query.sortBy ?? 'createdAt',
            sortDirection
        }
    }
    public normalizeUsersQuery(query: usersFilters):usersFilters {
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
}
