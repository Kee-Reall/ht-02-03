import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {CommentsService} from "../services/comments-service";
import {httpStatus} from "../enums/httpEnum";
import {LikeRequest} from "../models/RequestModel";
import {SearchError} from "../helpers/extendedErrors";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService
    ) {
    }

    public async updateComment(req: Request, res: Response) {
        const {comment, body: {content}} = req
        const result: boolean = await this.commentsService.updateCommentAfterMiddleware(comment, content)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    public async deleteComment(req: Request, res: Response) {
        const {params: {id}} = req
        const result = await this.commentsService.deleteCommentAfterMiddleware(id)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    public async getCommentById(req: Request, res: Response) {
        const unauthorized = req.unauthorized
        const comment = await this.commentsService.getCommentById(req.params.id, unauthorized ? null : req.user.id)
        if (!comment) {
            res.sendStatus(httpStatus.notFound)
        } else {
            res.status(httpStatus.ok).json(comment)
        }
    }

    public async setLike(req: LikeRequest, res: Response) {
        const {body: {likeStatus}, user} = req
        const userId = user.id
        try {
            res.sendStatus(await this.commentsService.likeComment(req.params.id, {likeStatus,userId}) ? httpStatus.noContent : httpStatus.teapot)
        } catch (e) {
            res.sendStatus(e instanceof SearchError ? httpStatus.notFound : httpStatus.teapot)
        }
    }
}