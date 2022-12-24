import {Router} from "express";
import {commentsController} from "../controllers/commentsController";
import {jwtAuth} from "../middleware/jwtAuth";
import {updateCommentMiddleware} from "../middleware/updateCommentMiddleware";

export const commentsRouter = Router()
const param = '/:id'
commentsRouter.put(param, jwtAuth, updateCommentMiddleware, commentsController.updateComment)
commentsRouter.delete(param,jwtAuth,commentsController.deleteComment)
commentsRouter.get(param,commentsController.getCommentById)