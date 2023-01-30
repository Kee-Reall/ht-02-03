export type eternityId = "blog" | "post" | "user" | "comment"
export type sortingDirection = "asc" | "desc"
export interface tokenPair {
    accessToken: string
    refreshToken: string
}

export type createTokenClientMeta = {
    userId: string
    ip: string
    deviceInfo: string
}

export type clientMeta = {
    deviceId: string
    ip?: string
    deviceInfo?: string
    userId: string
    updateDate: string
}