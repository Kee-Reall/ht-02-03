import {ObjectId} from "mongodb";

export type LikeStatus = "Like" | "Dislike" | "None"

export interface LikeModel {
    id: string
    addedAt: Date
    target: string
    userId: string
    login: string
    likeStatus: LikeStatus
}

export interface LikeDbModel {
    _id: ObjectId
}

export interface LikeInputModel {
    likeStatus: LikeStatus
}

export interface LikeDTO extends LikeInputModel{
    userId: string
}

export type LikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}

export type ExtendedLikesInfo = LikesInfo & {newestLikes: Array<Pick<LikeModel,'login' | 'addedAt'| 'userId'>>}

export  type WithLike<T> = T & {
    likesInfo: LikesInfo
}

export type WithExtendedLike<T> = T & {
    extendedLikesInfo: ExtendedLikesInfo
}