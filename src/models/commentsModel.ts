import {userForCommentsModel, userViewModel} from "./userModel";
import {ObjectId} from "mongodb";

export interface CommentsInputModel {
    content: string
}

export interface CommentsViewModel extends userForCommentsModel {
    content: string,
    userId: string,
    userLogin: string
    createdAt: string
}

export interface CommentsOutputModel extends CommentsViewModel {
    id: string
}

export interface CommentsDbModel {
    id: string
    content: string,
    userId: string,
    userLogin: string
    createdAt: string
    postId: string
    _id?: ObjectId
}

export interface CommentCreationModel {
    postId: string,
    content: string,
    user: userViewModel
}