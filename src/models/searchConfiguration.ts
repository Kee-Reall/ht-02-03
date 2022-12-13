import {Filter} from 'mongodb'

export interface SearchConfiguration<T> {
    filter?: Filter<T>
    sortBy: string
    shouldSkip: number
    limit: number
    sortDirection: "asc" | "desc"
}