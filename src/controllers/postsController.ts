import { Request, Response } from "express";
import {store} from "../dataLayer/store";


class PostsController {


    constructor(){}

    async getAll(req: Request, res: Response) {
        console.log('all', req.path)
        res.status(200).json({getAll:'Post'})
    }

    async getOne(req: Request, res: Response) {
        console.log('one', req.path)
        res.status(200).json({getOne:'Post'})
    }

    async createBlog(req: Request, res: Response) {
        const result = store.createBlog(req.body)
        res.status(201).json(result)
    }

    async updateBlogUsingId(req: Request,res: Response) {
        res.status(200).json({update:'Post'})
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        res.status(402).json({delete:'Post'})
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(405)
    }

}

export default new PostsController()