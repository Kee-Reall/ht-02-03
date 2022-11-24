import { Request, Response } from "express";
import { store } from "../dataLayer/store";
import { httpStatus } from "../enums/httpEnum";


class PostsController {


    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json(store.getAllPosts())
    }

    async getOne(req: Request, res: Response) {
        console.log('one', req.path)
        res.status(httpStatus.ok).json({getOne:'Post'})
    }

    async createPost(req: Request, res: Response) {
        const result = store.createPost(req.body)
        res.status(201).json(result)
    }

    async updatePostUsingId(req: Request,res: Response) {
        res.status(200).json({update:'Post'})
    }

    async deletePostUsingId(req: Request, res: Response) {
        res.status(402).json({delete:'Post'})
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(405)
    }

}
const postsController = new PostsController()
export { postsController }