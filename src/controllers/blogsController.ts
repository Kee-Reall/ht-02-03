import { Request, Response } from "express";
import { dbStore as store } from "../dataLayer/dbStore";
import {httpStatus} from "../enums/httpEnum";

class BlogsController {

    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json(await store.getAllBlogs())
    }

    async getOne(req: Request, res: Response) {
        const result = await store.getBlog(req.params.id)
        if(result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createBlog(req: Request, res: Response) {
        const result = await store.createBlog(req.body)
        res.status(httpStatus.created).json(result)
    }

    async updateBlogUsingId(req: Request,res: Response) {
        const result = await store.updateBlog(req.params.id,req.body)
        if(result) {
            return res.sendStatus(httpStatus.noContent) 
        }
        res.sendStatus(httpStatus.notFound)
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        const result = await store.deleteBlog(req.params.id)
        if(result) {
            return res.sendStatus(httpStatus.noContent)
        }
        res.sendStatus(httpStatus.notFound)
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(httpStatus.deprecated)
    }
}

export default new BlogsController()