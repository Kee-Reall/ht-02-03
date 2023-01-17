export type eternityId = "blog" | "post" | "user" | "comment"
export type sortingDirection = "asc" | "desc"
export interface tokenPair {
    accessToken: string
    refreshToken: string
}