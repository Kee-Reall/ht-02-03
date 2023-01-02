import {NextFunction, Request, Response} from "express";
import {queryRepository} from "../repositories/queryRepository";
import {httpStatus} from "../enums/httpEnum";

export const isOwnerMiddleware = async (req: Request,res: Response, next: NextFunction) => {
    const { params:{ id }} = req
    const commentShouldChange = await queryRepository.getCommentById(id)
    if (commentShouldChange === null) {
        return res.sendStatus(httpStatus.notFound)
    }
    const {userId} = commentShouldChange
    if (id === userId){
        req.comment = commentShouldChange
        return next()
    }
    res.sendStatus(httpStatus.forbidden)
}
