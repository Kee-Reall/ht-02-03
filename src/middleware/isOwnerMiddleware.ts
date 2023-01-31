import {NextFunction, Request, RequestHandler, Response} from "express";
import {queryRepository} from "../repositories/queryRepository";
import {httpStatus} from "../enums/httpEnum";

export const isOwnerMiddleware: RequestHandler = async (req: Request,res: Response, next: NextFunction) => {
    const {user , params:{ id }} = req
    const commentShouldChange = await queryRepository.getCommentById(id)
    if (!commentShouldChange) {
        return res.sendStatus(httpStatus.notFound)
    }
    if (user.id === commentShouldChange.userId) {
        req.comment = commentShouldChange
        return next()
    }
    res.sendStatus(httpStatus.forbidden)
}
