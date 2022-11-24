import { Request, Response } from "express";
import { store } from "../dataLayer/store";
import {httpStatus} from "../enums/httpEnum";

class BlogsController {

    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json(store.getAllBlogs())
    }

    async getOne(req: Request, res: Response) {
        const result = store.getBlog(req.params.id)
        if(result) {
           return res.status(httpStatus.ok).json(result) 
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createBlog(req: Request, res: Response) {
        const result = store.createBlog(req.body)
        res.status(httpStatus.created).json(result)
    }

    async updateBlogUsingId(req: Request,res: Response) {
        const result = store.updateBlog(req.params.id,req.body)
        if(result) {
            return res.sendStatus(httpStatus.noContent) 
        }
        res.sendStatus(httpStatus.notFound)
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        const result = store.delete(req.params.id)
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