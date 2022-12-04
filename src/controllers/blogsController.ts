import { Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";
import { blogsService } from "../services/blogs-service";
import {blog, blogFilters} from "../models/blogModel";
import {customRequest} from "../models/RequestModel";
import {getBlogResponse} from "../models/ResponseModel";

class BlogsController {

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json(await blogsService.getAllBlogs())
    }

    async getBlogs(req: customRequest<blogFilters>, res: getBlogResponse) {
        const result = await blogsService.getBlogs(req.query)
        // @ts-ignore
        res.status(httpStatus.ok).json(result)
    }

    async getOne(req: Request, res: Response) {
        const result: blog = await blogsService.getBlog(req.params.id)
        if(result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createBlog(req: Request, res: Response) {
        const result: blog = await blogsService.createBlog(req.body)
        if(result) {
            res.status(httpStatus.created).json(result)
            return
        }
        res.sendStatus(httpStatus.teapot)
    }

    async updateBlogUsingId(req: Request,res: Response) {
        const result: boolean = await blogsService.updateBlog(req.params.id,req.body)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        const result: boolean = await blogsService.deleteBlog(req.params.id)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(httpStatus.deprecated)
    }
}

export default new BlogsController()