import { Router } from "express";
import blogsController from "../controllers/blogsController";
import { blogMiddlewares } from "../middleware/blogsMiddleware";
import {getBlogsMiddleware} from "../middleware/getBlogsMiddleware";
export const blogsRouter = Router()
const root = '/'
const param = root + ':id'

blogsRouter.get(root, ...getBlogsMiddleware, blogsController.getBlogs)
blogsRouter.get(param, blogsController.getOne)
blogsRouter.post(root, ...blogMiddlewares , blogsController.createBlog)
blogsRouter.put(param, ...blogMiddlewares, blogsController.updateBlogUsingId)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)
blogsRouter.patch(root, blogsController.deprecated)
blogsRouter.patch(param, blogsController.deprecated)