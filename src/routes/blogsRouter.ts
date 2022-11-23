import { Router } from "express";
import blogsController from "../controllers/blogsController";
import { blogMiddlewares } from "../middleware/blogsMiddleware";
export const blogsRouter = Router()
const root = '/'
const param = root + ':id'

blogsRouter.get(root  , blogsController.getAll)
blogsRouter.get(param , blogsController.getOne)
blogsRouter.post(root, ...blogMiddlewares , blogsController.createBlog)
blogsRouter.put(param , ...blogMiddlewares, blogsController.updateBlogUsingId)
blogsRouter.patch(root , blogsController.deprecated)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)