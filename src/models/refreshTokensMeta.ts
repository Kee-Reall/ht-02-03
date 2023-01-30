import {JwtPayload} from "jsonwebtoken";

export interface refreshTokensMeta {
    userId: string
    deviceId: string
    updateDate: Date
    ip: Array<string | "undetected">
    deviceInfo: string | null
}

export interface refreshTokenPayload extends JwtPayload {
    userId: string
    deviceId: string
    updateDate: string
}

export interface sessionFilter {
    userId: string
    deviceId: string
}

export interface refreshTokenDbResponse {
    deviceId: string
    updateDate: Date
}

export interface updateRefreshTokenMeta {
    userId: string
    deviceId: string
    ip: string | null
}