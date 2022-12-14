import {ObjectId} from "mongodb";

export interface postViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export interface postDbModel extends postViewModel{
    _id: ObjectId
}

export interface postInputThrowBlog {
    title: string
    shortDescription: string
    content: string
}

export interface postInputModel {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type post = postViewModel | null
export type posts = Array<postViewModel> | null