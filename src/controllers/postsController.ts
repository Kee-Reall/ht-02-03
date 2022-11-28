import { Request, Response } from "express";
import { dbStore as store } from "../dataLayer/dbStore";
import { httpStatus } from "../enums/httpEnum";


class PostsController {

    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json( await store.getAllPosts())
    }

    async getOne(req: Request, res: Response) {
        const result = await store.getPost(req.params.id)
        if(result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createPost(req: Request, res: Response) {
        const result = await store.createPost(req.body)
        res.status(httpStatus.created).json(result)
    }

    async updatePostUsingId(req: Request,res: Response) {
        const result = await store.updatePost(req.params.id,req.body)
        if(result) {
            res.sendStatus(httpStatus.noContent)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async deletePostUsingId(req: Request, res: Response) {
        const result = await store.deletePost(req.params.id)
        if(result) {
            res.sendStatus(httpStatus.noContent)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(httpStatus.deprecated)
    }

}
const postsController = new PostsController()
export { postsController }