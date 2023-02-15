import {Router} from "express";
import {CommentsController} from "../controllers/commentsController";
import {jwtAuth} from "../middleware/jwtAuth";
import {updateCommentMiddleware} from "../middleware/updateCommentMiddleware";
import {isOwnerMiddleware} from "../middleware/isOwnerMiddleware";
import {iocContainer} from "../containers/iocContainer";
import {likeMiddleWare} from "../middleware/likeMiddleWare";
import {jwtAuthWithoutBlock} from "../middleware/jwtAuthWithoutBlock";

const commentsController = iocContainer.resolve(CommentsController)

export const commentsRouter = Router()
const param = '/:id'
const like: string = param + '/like-status'
commentsRouter.put(param, jwtAuth, updateCommentMiddleware, isOwnerMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete(param, jwtAuth, isOwnerMiddleware,commentsController.deleteComment.bind(commentsController))
commentsRouter.get(param,jwtAuthWithoutBlock,commentsController.getCommentById.bind(commentsController))
commentsRouter.put(like,jwtAuth,...likeMiddleWare,commentsController.setLike.bind(commentsController))