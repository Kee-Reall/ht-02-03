import {ObjectId} from "mongodb";

export interface blogViewModel {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export interface blogDbModel extends blogViewModel {
    _id: ObjectId
}

export interface blogInputModel {
    name: string
    description: string
    websiteUrl: string
}