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
}

export interface userDbModel extends userLogicModel {
    _id?: ObjectId
}