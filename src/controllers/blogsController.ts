import { Request, Response } from "express";


class BlogsController {


    constructor(){}

    async getAll(req: Request, res: Response) {
        console.log('all', req.path)
        res.status(200).json({getAll:'Blog'})
    }

    async getOne(req: Request, res: Response) {
        console.log('one', req.path)
        res.status(200).json({getOne:'Blog'})
    }

    async createBlog(req: Request, res: Response) {
        res.status(400).json({create:'Blog'})
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