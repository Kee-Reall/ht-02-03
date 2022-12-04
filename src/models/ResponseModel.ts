import {Response} from "express";
import {blogViewModel} from "./blogModel";

type output = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: Array<blogViewModel>
}

type customResponse<T> = Response<T>

export type getBlogResponse = customResponse<output>