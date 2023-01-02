import {Filter} from 'mongodb'
import { sortingDirection } from './mixedModels'

export interface SearchConfiguration<T> {
    filter?: Filter<T>
    sortBy: string
    shouldSkip: number
    limit: number
    sortDirection: sortingDirection
}