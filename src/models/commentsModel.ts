import {userForCommentsModel, userViewModel} from "./userModel";
import {ObjectId} from "mongodb";

export interface commentsInputModel {
    content: string
}

export interface commentsViewModel extends userForCommentsModel {
    content: string,
    userId: string,
    userLogin: string
    createdAt: string
}

export interface commentsOutputModel extends commentsViewModel {
    id: string
}

export interface commentsDbModel {
    id: string
    content: string,
    userId: string,
    userLogin: string
    createdAt: string
    postId: string
    _id?: ObjectId
}

export interface commentCreationModel {
    postId: string,
    content: string,
    user: userViewModel
}