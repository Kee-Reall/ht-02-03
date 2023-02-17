import {NextFunction, Request, RequestHandler, Response} from "express";
import {QueryRepository} from "../repositories/queryRepository";
import {httpStatus} from "../enums/httpEnum";
import {iocContainer} from "../containers/iocContainer";

export const isOwnerMiddleware: RequestHandler = async (req: Request,res: Response, next: NextFunction) => {
    const {user , params:{ id }} = req
    const queryRepository = iocContainer.resolve(QueryRepository)
    const commentShouldChange = await queryRepository.getCommentById(id)
    if (!commentShouldChange) {
        return res.sendStatus(httpStatus.notFound)
    }
    if (user.id === commentShouldChange.commentatorInfo.userId) {
        req.comment = commentShouldChange
        return next()
    }
    res.sendStatus(httpStatus.forbidden)
}
