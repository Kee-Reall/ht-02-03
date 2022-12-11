import {Response} from "express";
import {blogViewModel} from "./blogModel";
import {postViewModel} from "./postsModel";
import {userViewModel} from "./userModel";

export type getOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<blogViewModel | postViewModel | userViewModel>
}

export type customResponse<T> = Response<T>

export type getBlogResponse = customResponse<getOutput>