import {ObjectId} from "mongodb";

export interface PostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export interface PostDbModel extends PostViewModel{
    _id: ObjectId
}

export interface PostInputThroughBlog {
    title: string
    shortDescription: string
    content: string
}

export interface PostInputModel {
    title: string
    shortDescription: string
    content: string
    blogId: string
}