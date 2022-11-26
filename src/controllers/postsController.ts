import { Request, Response } from "express";
import { store } from "../dataLayer/store";
import { httpStatus } from "../enums/httpEnum";


class PostsController {

    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json(store.getAllPosts())
    }

    async getOne(req: Request, res: Response) {
        const result = store.getPost(req.params.id)
        if(result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createPost(req: Request, res: Response) {
        const result = store.createPost(req.body)
        res.status(httpStatus.created).json(result)
    }

    async updatePostUsingId(req: Request,res: Response) {
        const result = store.updatePost(req.params.id,req.body)
        if(result) {
            res.sendStatus(httpStatus.noContent)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async deletePostUsingId(req: Request, res: Response) {
        const result = store.deletePost(req.params.id)
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