import {ObjectId} from "mongodb";
import {Nullable} from "./mixedModels";

export interface UserViewModel {
    id: string
    login: string
    email: string
    createdAt: string
}

export interface UserInputModel {
    login: string
    email: string
    password: string
}

export interface UserInputModelFromFront extends UserInputModel{
    customDomain: Nullable<string>
}

export interface UserLogicModel {
    id: string
    login: string
    email: string
    createdAt: string
    hash:string
    salt: string
    confirmation:Confirmation
    recovery: Recovery
}

export type Recovery = {
    recoveryCode: string,
    expirationDate: Date
}

export type Confirmation = {
    isConfirmed: boolean
    code: string
    confirmationDate: Date
}

export interface UserDbModel extends UserLogicModel {
    _id?: ObjectId
}

export interface UserForCommentsModel {
    userLogin: string,
    userId: string
}