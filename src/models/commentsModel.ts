import {userForCommentsModel} from "./userModel";
import {ObjectId} from "mongodb";

export interface CommentsInputModel {
    content: string
}

export interface CommentsViewModel extends userForCommentsModel{
    id: string,
    content: string,
    userId: string,
    userLogin: string
    createdAt: string
}

export interface CommentsDbModel extends CommentsViewModel {
    _id: ObjectId
}