import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import { postsController } from "../controllers/postsController";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'
const comments = param + '/comments'

postsRouter.get(root, postsController.getPosts)
postsRouter.get(param, postsController.getOne)
postsRouter.post(root, ...postMiddlewares, postsController.createPost)
postsRouter.put(param, ...postMiddlewares, postsController.updatePostUsingId)
postsRouter.delete(param,postsController.deletePostUsingId)
postsRouter.patch(root  ,postsController.deprecated)
postsRouter.patch(param  ,postsController.deprecated)
postsRouter.get(comments, postsController.getCommentsForPost)
postsRouter.post(comments, postsController.createCommentForPost)