import {Request, Response} from "express";
import {commentsService} from "../services/comments-service";
import {httpStatus} from "../enums/httpEnum";

class CommentsController {
    async updateComment(req: Request, res: Response) {
        const {comment, body:{content}} = req
        const result: boolean = await commentsService.updateCommentAfterMiddleware(comment,content)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    async deleteComment(req: Request, res: Response) {
        const { params: { id }} = req
        const result = await commentsService.deleteCommentAfterMiddleware(id)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }
    async getCommentById(req: Request, res: Response){
        const comment = await commentsService.getCommentById(req.params.id)
        if(comment === null) {
            res.sendStatus(httpStatus.notFound)
        } else {
            res.status(httpStatus.ok).json(comment)
        }
    }
}

export const commentsController = new CommentsController()