import { Response } from "express";
import { blogViewModel } from "./blogModel";
import { commentsOutputModel } from "./commentsModel";
import { postViewModel } from "./postsModel";
import { userViewModel } from "./userModel";

export type getOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<blogViewModel | postViewModel | userViewModel | commentsOutputModel>
}

export type customResponse<T> = Response<T>

export type getItemsResponse = customResponse<getOutput>