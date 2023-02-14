import {ObjectId} from "mongodb";

export interface BlogViewModel {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export interface BlogDbModel extends BlogViewModel {
    _id: ObjectId
}

export interface BlogInputModel {
    name: string
    description: string
    websiteUrl: string
}

export type Blog = BlogViewModel | null
export type Blogs = Array<BlogViewModel> | null
