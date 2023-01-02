import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import { postsController } from "../controllers/postsController";
import {jwtAuth} from "../middleware/jwtAuth";
import { createCommentMiddlewares } from "../middleware/createCommentMiddleware";
import {basicAuth} from "../middleware/basicAuth";
import {getCommentsMiddleware} from "../middleware/getCommentsMiddleware";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'
const comments = param + '/comments'

postsRouter.get(root, postsController.getPosts)
postsRouter.get(param, postsController.getOne)
postsRouter.post(root, basicAuth, ...postMiddlewares, postsController.createPost)
postsRouter.put(param, basicAuth, ...postMiddlewares, postsController.updatePostUsingId)
postsRouter.delete(param, basicAuth,postsController.deletePostUsingId)
postsRouter.patch(root  ,postsController.deprecated)
postsRouter.patch(param, postsController.deprecated)
postsRouter.get(comments, ...getCommentsMiddleware ,postsController.getCommentsForPost)
postsRouter.post(comments, jwtAuth, ...createCommentMiddlewares, postsController.createCommentForPost)