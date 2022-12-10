import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import { postsController } from "../controllers/postsController";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'

postsRouter.get(root, postsController.getPosts)
postsRouter.get(param, postsController.getOne)
postsRouter.post(root, ...postMiddlewares, postsController.createPost)
postsRouter.put(param, ...postMiddlewares, postsController.updatePostUsingId)
postsRouter.delete(param,postsController.deletePostUsingId)
postsRouter.patch(root  ,postsController.deprecated)
postsRouter.patch(param  ,postsController.deprecated)