import { Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";
import { blogsService } from "../services/blogs-service";
import {blog} from "../models/blogModel";
import {customRequest} from "../models/RequestModel";
import {getItemsResponse} from "../models/ResponseModel";
import {blogFilters} from "../models/filtersModel";
import {normalizeBlogsQuery} from "../helpers/normalizeBlogsQuery";
import {normalizePostsQuery} from "../helpers/normalizePostsQuery";
import { post } from "../models/postsModel";

class BlogsController {

    async getBlogs(req: customRequest<blogFilters>, res: getItemsResponse) {
        const result = await blogsService.getBlogs(normalizeBlogsQuery(req.query))
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

    async createPostForThisBlog(req: Request, res: Response) {
        const result: post = await blogsService.createPostForBlog(req.params.id,req.body)
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

    async getBlogsPost(req: Request, res: Response) {
        const query = normalizePostsQuery(req.query)
        const result = await(blogsService.getBlogPosts(req.params.id, query))
        res.json(result)
    }

    deprecated(_: Request, res:Response) {
        res.sendStatus(httpStatus.deprecated)
    }
}

export default new BlogsController()