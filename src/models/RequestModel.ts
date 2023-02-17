import {Request} from "express";
import {LikeInputModel} from "./LikeModel";

export type CustomRequest<T> = Request<{},{},{},T,{}>
export type LikeRequest = Request<{id: string},{},LikeInputModel,{},{}>