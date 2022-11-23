import { Request, Response } from "express";
import { store } from "../dataLayer/store";
import {httpStatus} from "../enums/httpEnum";

class BlogsController {


    constructor(){}

    async getAll(req: Request, res: Response) {
        res.status(200).json(store.getAllBlogs())
    }

    async getOne(req: Request, res: Response) {
        console.log('one', req.path)
        res.status(httpStatus.ok).json(store.getBlog(req.params.id))
    }

    async createBlog(req: Request, res: Response) {
        const result = store.createBlog(req.body)
        res.status(201).json(result)
    }

    async updateBlogUsingId(req: Request,res: Response) {
        res.status(200).json({update:'Blog'})
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        res.status(402).json({delete:'blog'})
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(405)
    }

}

export default new BlogsController()