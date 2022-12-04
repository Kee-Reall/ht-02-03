import {Request} from "express";

export type customRequest<T> = Request<{},{},{},T,{}>