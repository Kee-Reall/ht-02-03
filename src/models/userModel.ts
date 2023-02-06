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
    confirmation:confirmation
    recovery: recovery
}

export type recovery = {
    recoveryCode: string,
    expirationDate: Date
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