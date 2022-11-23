import { Request, Response } from "express";


class blogsController {


    constructor(){}

    async getAll(req: Request, res: Response) {
        console.log('all', req.path)
        res.status(200).json({get:'state'})
    }

    async getOne(req: Request, res: Response) {
        console.log('one', req.path)
        res.status(200).json({get:'oneByw'})
    }

    async createBlog(req: Request, res: Response) {
        res.status(400).json({pi:'324'})
    }

    async updateBlogUsingId(req: Request,res: Response) {
        res.status(200).json({update:true})
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        res.status(402).json({402:402})
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(405)
    }

}

export default new blogsController()