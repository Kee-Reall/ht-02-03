import {ObjectId} from "mongodb";

export interface userViewModel {
    id: string
    login: string
    email: string
    createdAt: string
}

export interface userInputModel {
    login: string
    email: string
    password: string
}

export interface userLogicModel {
    id: string
    login: string
    email: string
    createdAt: string
    hash:string
    salt: string
    confirmation?:confirmation
    refreshTokens: userTokensData
}

export type userTokensData = {
    current: string
    expired: Array<string>
}

export type userUpdateTokenModel = {
    id: string
    nextToken: string
    previousToken: string
}

export type confirmation = {
    isConfirmed: boolean
    code: string
    confirmationDate: Date
}

export interface userDbModel extends userLogicModel {
    _id?: ObjectId
}

export interface userForCommentsModel {
    userLogin: string,
    userId: string
}