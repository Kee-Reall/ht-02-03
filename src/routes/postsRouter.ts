import { Router } from "express";
import postsController from "../controllers/blogsController";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'

postsRouter.get(root    ,postsController.getAll)
postsRouter.get(param   ,postsController.getOne)
postsRouter.post(root   ,postsController.createBlog)
postsRouter.put(param   ,postsController.updateBlogUsingId)
postsRouter.patch(root  ,postsController.deprecated)
postsRouter.delete(param,postsController.deleteBlogUsingId)