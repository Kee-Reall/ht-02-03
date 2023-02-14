import {BlogFilters, CommentsFilter, UsersFilters} from "../models/filtersModel";
import {sortingDirection} from "../models/mixedModels";
import {injectable} from "inversify";

@injectable()
export class Normalizer {
    public normalizeSortDirection (argument?: any): sortingDirection {
        return argument === 'asc' ? argument : 'desc'
    }
    public normalizeBlogsQuery(query: BlogFilters):BlogFilters {
            const sortDirection = this.normalizeSortDirection(query.sortDirection)
            return {
                searchNameTerm: query.searchNameTerm ?? '[*]*',
                pageNumber: +query.pageNumber! || 1,
                pageSize: +query.pageSize! || 10,
                sortBy: query.sortBy ?? 'createdAt',
                sortDirection
            }
    }
    public normalizeCommentQuery(query: CommentsFilter):CommentsFilter {
        const sortDirection = this.normalizeSortDirection(query.sortDirection)
        return {
            pageNumber: +query.pageNumber! || 1,
            pageSize: +query.pageSize! || 10,
            sortBy: query.sortBy ?? 'createdAt',
            sortDirection
        }
    }
    public normalizePostsQuery(query: BlogFilters):BlogFilters {
        const sortDirection = this.normalizeSortDirection(query.sortDirection)
        return {
            pageNumber: +query.pageNumber! || 1,
            pageSize: +query.pageSize! || 10,
            sortBy: query.sortBy ?? 'createdAt',
            sortDirection
        }
    }
    public normalizeUsersQuery(query: UsersFilters):UsersFilters {
        const sortDirection = this.normalizeSortDirection(query.sortDirection)
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
