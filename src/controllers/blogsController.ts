import {Request, Response} from "express";
import {injectable, inject} from 'inversify'
import {httpStatus} from "../enums/httpEnum";
import {Blog} from "../models/blogModel";
import {CustomRequest} from "../models/RequestModel";
import {GetItemsResponse} from "../models/ResponseModel";
import {BlogFilters} from "../models/filtersModel";
import {BlogsService} from "../services/blogs-service";
import {Normalizer} from "../helpers/normalizer";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(Normalizer) protected normalizer: Normalizer
    ) {}

    async getBlogs(req: CustomRequest<BlogFilters>, res: GetItemsResponse) {
        const result = await this.blogsService.getBlogs(this.normalizer.normalizeBlogsQuery(req.query))
        res.status(httpStatus.ok).json(result)
    }

    async getOne(req: Request, res: Response) {
        const result: Blog = await this.blogsService.getBlog(req.params.id)
        if (result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async createBlog(req: Request, res: Response) {
        const result: Blog = await this.blogsService.createBlog(req.body)
        if (result) {
            return res.status(httpStatus.created).json(result)
        }
        res.sendStatus(httpStatus.teapot)
    }

    async createPostForThisBlog(req: Request, res: Response) {
        const result = await this.blogsService.createPostForBlog(req.params.id, req.body)
        if (result) {
            res.status(httpStatus.created).json(result)
            return
        }
        res.sendStatus(httpStatus.teapot)
    }

    async updateBlogUsingId(req: Request, res: Response) {
        const result: boolean = await this.blogsService.updateBlog(req.params.id, req.body)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async deleteBlogUsingId(req: Request, res: Response) {
        const result: boolean = await this.blogsService.deleteBlog(req.params.id)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async getBlogsPost(req: Request, res: Response) {
        const unauthorized = req.unauthorized
        const query = this.normalizer.normalizePostsQuery(req.query)
        const result = await (this.blogsService.getBlogPosts(req.params.id, query, unauthorized ? null : req.user.id))
        res.json(result)
    }

    deprecated(_: Request, res: Response) {
        res.sendStatus(httpStatus.deprecated)
    }
}