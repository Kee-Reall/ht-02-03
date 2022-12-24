import {Request, Response} from "express";
import {commentsService} from "../services/comments-service";
import {userViewModel} from "../models/userModel";
import {httpStatus} from "../enums/httpEnum";

class CommentsController {
    async updateComment(req: Request, res: Response) {
        const { user, body: input, params: { id }} = req
        const comment = await commentsService.updateComment(id, input, user as userViewModel)
        switch (comment) {
            case "not exist": res.sendStatus(httpStatus.notFound)
            case "initiator not owner": res.sendStatus(httpStatus.forbidden)
            case "ok": res.sendStatus(httpStatus.ok)
        }
    }

    async deleteComment(req: Request, res: Response) {

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