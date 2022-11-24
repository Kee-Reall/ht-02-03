import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import { postsController } from "../controllers/postsController";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'

postsRouter.get(root, postsController.getAll)
postsRouter.get(param, postsController.getOne)
postsRouter.post(root, ...postMiddlewares, postsController.createPost)
postsRouter.post(param, postsController.deprecated)
postsRouter.put(root   ,postsController.deprecated)
postsRouter.put(param, ...postMiddlewares, postsController.updatePostUsingId)
postsRouter.patch(root  ,postsController.deprecated)
postsRouter.patch(param  ,postsController.deprecated)
postsRouter.delete(root  ,postsController.deprecated)
postsRouter.delete(param,postsController.deletePostUsingId)