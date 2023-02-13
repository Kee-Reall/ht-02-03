import {Router} from "express";
import {CommentsController} from "../controllers/commentsController";
import {jwtAuth} from "../middleware/jwtAuth";
import {updateCommentMiddleware} from "../middleware/updateCommentMiddleware";
import {isOwnerMiddleware} from "../middleware/isOwnerMiddleware";
import {commentContainer} from "../containers/commentContainer";

const commentsController = commentContainer.resolve(CommentsController)

export const commentsRouter = Router()
const param = '/:id'
commentsRouter.put(param, jwtAuth, updateCommentMiddleware, isOwnerMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete(param, jwtAuth, isOwnerMiddleware,commentsController.deleteComment.bind(commentsController))
commentsRouter.get(param,commentsController.getCommentById.bind(commentsController))