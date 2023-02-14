import {Request} from "express";

export type CustomRequest<T> = Request<{},{},{},T,{}>