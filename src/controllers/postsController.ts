import { Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";
import { postsService } from "../services/posts-service";
import { post } from "../models/postsModel";
import {normalizePostsQuery} from "../helpers/normalizePostsQuery";


class PostsController {

    async getAll(req: Request, res: Response) {
        res.status(httpStatus.ok).json( await postsService.getAllPosts())
    }

    async getOne(req: Request, res: Response) {
        const { params: { id }} = req
        const result = await postsService.getPost(id)
        if(result) {
            res.status(httpStatus.ok).json(result)
            return
        }
        res.sendStatus(httpStatus.notFound)
    }

    async getPosts(req: Request, res: Response) {
        const query = normalizePostsQuery(req.query)
        const result = await(postsService.getPostsWithPagination(query))
        res.status(httpStatus.ok).json(result)
    }

    async createPost(req: Request, res: Response) {
        const result: post = await postsService.createPost(req.body)
        res.status(httpStatus.created).json(result)
    }

    async updatePostUsingId(req: Request,res: Response) {
        const result: boolean = await postsService.updatePost(req.params.id, req.body)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async deletePostUsingId(req: Request, res: Response) {
        const result: boolean = await postsService.deletePost(req.params.id)
        const status: number = result ? httpStatus.noContent : httpStatus.notFound
        res.sendStatus(status)
    }

    async getCommentsForPost(req: Request, res: Response) {

    }



    async createCommentForPost(req: Request, res: Response) {
        const { body:{ content }, params:{ id: postId }, user } = req
        const result: boolean = await postsService.createComment({content,postId,user})
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    async deprecated(_: Request, res:Response) {
        res.sendStatus(httpStatus.deprecated)
    }

}
const postsController = new PostsController()
export { postsController }