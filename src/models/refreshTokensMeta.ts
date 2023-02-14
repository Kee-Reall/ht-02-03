import {JwtPayload} from "jsonwebtoken";

export interface RefreshTokensMeta {
    userId: string
    deviceId: string
    updateDate: Date
    ip: Array<string | "undetected">
    title: string | null
}

export interface RefreshTokenPayload extends JwtPayload {
    userId: string
    deviceId: string
    updateDate: string
}

export interface SessionFilter {
    userId: string
    deviceId: string
}

export interface RefreshTokenDbResponse {
    deviceId: string
    updateDate: Date
}

export interface UpdateRefreshTokenMeta {
    userId: string
    deviceId: string
    ip: string | null
}