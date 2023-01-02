import {Router} from "express";
import {commentsController} from "../controllers/commentsController";
import {jwtAuth} from "../middleware/jwtAuth";
import {updateCommentMiddleware} from "../middleware/updateCommentMiddleware";
import {isOwnerMiddleware} from "../middleware/isOwnerMiddleware";

export const commentsRouter = Router()
const param = '/:id'
commentsRouter.put(param, jwtAuth, updateCommentMiddleware, isOwnerMiddleware, commentsController.updateComment)
commentsRouter.delete(param, jwtAuth, isOwnerMiddleware,commentsController.deleteComment)
commentsRouter.get(param,commentsController.getCommentById)