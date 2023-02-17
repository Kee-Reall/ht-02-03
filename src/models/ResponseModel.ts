import { Response } from "express";
import { BlogViewModel } from "./blogModel";
import { CommentsOutputModel } from "./commentsModel";
import { PostViewModel } from "./postsModel";
import { UserViewModel } from "./userModel";

export type GetOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<BlogViewModel | PostViewModel | UserViewModel | CommentsOutputModel>
}

export type CustomResponse<T> = Response<T>

export type GetItemsResponse = CustomResponse<GetOutput>