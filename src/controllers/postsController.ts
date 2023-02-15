import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {PostsService} from "../services/posts-service";
import {Post} from "../models/postsModel";
import {CommentsFilter} from "../models/filtersModel";
import {Normalizer} from "../helpers/normalizer";
import {CommentsService} from "../services/comments-service";

@injectable()
export class PostsController {

    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsService) protected commentService: CommentsService,
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
        const result: Post = await this.postsService.createPost(req.body)
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
        const query: CommentsFilter = {
            ...this.normalizer.normalizeCommentQuery(req.query),
            searchId: req.params.id as string
        }
        const userId = req.unauthorized ? null : req.user.id
        res.status(httpStatus.ok).json(await this.commentService.getCommentsByPost(query,userId))
    }

    async createCommentForPost(req: Request, res: Response) {
        const {body: {content}, params: {id: postId}, user} = req
        const result = await this.commentService.createComment({content, postId, user})
        if (result === null) {
            return res.sendStatus(httpStatus.teapot)
        }
        res.status(httpStatus.created).json(result)
    }

    async deprecated(_: Request, res: Response) {
        res.sendStatus(httpStatus.deprecated)
    }

}