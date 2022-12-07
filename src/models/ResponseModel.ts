import {Response} from "express";
import {blogViewModel} from "./blogModel";

export type getOutput = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<blogViewModel>
}

export type customResponse<T> = Response<T>

export type getBlogResponse = customResponse<getOutput>