import { Router } from "express";
import blogsController from "../controllers/blogsController";
import { createBlogMiddlewares, updateBlogMiddlewares } from "../middleware/blogsMiddleware";
const blogsRouter = Router()
const root = '/'
const param = root + ':id'

blogsRouter.get(root  , blogsController.getAll)
blogsRouter.get(param , blogsController.getOne)
blogsRouter.post(root, createBlogMiddlewares , blogsController.createBlog)
blogsRouter.put(param , ...updateBlogMiddlewares, blogsController.updateBlogUsingId)
blogsRouter.patch(root , blogsController.deprecated)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)