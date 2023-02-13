import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {PostsService} from "../services/posts-service";
import {post} from "../models/postsModel";
import {commentsFilter} from "../models/filtersModel";
import {Normalizer} from "../helpers/normalizer";

@injectable()
export class PostsController {

    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(Normalizer) protected normalizer: Normalizer
    ) {}

    async getOne(req: Request, res: Response) {
        const {params: {id}} = req
        const result = await this.postsService.getPost(id)
        if (result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async getPosts(req: Request, res: Response) {
        const query = this.normalizer.normalizePostsQuery(req.query)
        const result = await (this.postsService.getPostsWithPagination(query))
        res.status(httpStatus.ok).json(result)
    }

    async createPost(req: Request, res: Response) {
        const result: post = await this.postsService.createPost(req.body)
        if (!result) {
            return res.sendStatus(httpStatus.teapot)
        }
        res.status(httpStatus.created).json(result)
    }

    async updatePostUsingId(req: Request, res: Response) {
        const result: boolean = await this.postsService.updatePost(req.params.id, req.body)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async deletePostUsingId(req: Request, res: Response) {
        const result: boolean = await this.postsService.deletePost(req.params.id)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async getCommentsForPost(req: Request, res: Response) {
        const query: commentsFilter = {
            ...this.normalizer.normalizeCommentQuery(req.query),
            searchId: req.params.id as string
        }
        res.status(httpStatus.ok).json(await this.postsService.getCommentForPost(query))
    }

    async createCommentForPost(req: Request, res: Response) {
        const {body: {content}, params: {id: postId}, user} = req
        const result = await this.postsService.createComment({content, postId, user})
        if (result === null) {
            return res.sendStatus(httpStatus.teapot)
        }
        res.status(httpStatus.created).json(result)
    }

    async deprecated(_: Request, res: Response) {
        res.sendStatus(httpStatus.deprecated)
    }

}