import {inject,injectable} from "inversify";
import {Request, Response} from "express";
import {CommentsService} from "../services/comments-service";
import {httpStatus} from "../enums/httpEnum";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService
    ) {}
    public async updateComment(req: Request, res: Response) {
        const { comment, body: { content }} = req
        const result: boolean = await this.commentsService.updateCommentAfterMiddleware(comment,content)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    public async deleteComment(req: Request, res: Response) {
        const { params: { id }} = req
        const result = await this.commentsService.deleteCommentAfterMiddleware(id)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }
    public async getCommentById(req: Request, res: Response){
        const comment = await this.commentsService.getCommentById(req.params.id)
        if(!comment) {
            res.sendStatus(httpStatus.notFound)
        } else {
            res.status(httpStatus.ok).json(comment)
        }
    }
}