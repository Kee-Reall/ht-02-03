export interface SearchConfiguration {
    filter?:{
        [key: string] : string
    }
    sortBy: string
    shouldSkip: number
    limit: number
    sortDirection: "asc" | "desc"
}