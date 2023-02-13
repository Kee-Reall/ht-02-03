import {NextFunction, Request, RequestHandler, Response} from "express";
import {QueryRepository} from "../repositories/queryRepository";
import {httpStatus} from "../enums/httpEnum";
import {commentContainer} from "../containers/commentContainer";

export const isOwnerMiddleware: RequestHandler = async (req: Request,res: Response, next: NextFunction) => {
    const {user , params:{ id }} = req
    const queryRepository = commentContainer.resolve(QueryRepository)
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
