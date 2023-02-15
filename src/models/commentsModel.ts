import {UserForCommentsModel, UserViewModel} from "./userModel";
import {ObjectId} from "mongodb";

export interface CommentsInputModel {
    content: string
}

export interface CommentsLogicModel {
    content: string,
    commentatorInfo: UserForCommentsModel
    createdAt: string
}

export interface CommentsOutputModel extends CommentsLogicModel {
    id: string
}

export interface CommentsDbModel {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    postId: string
    _id?: ObjectId
}

export interface CommentCreationModel {
    postId: string,
    content: string,
    user: UserViewModel
}