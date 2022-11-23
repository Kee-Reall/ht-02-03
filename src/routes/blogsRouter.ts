import { Router } from "express";
import blogsController from "../controllers/blogsController";

const blogsRouter = Router()

const root = '/'
const param = root + ':id'

blogsRouter.get(   root , blogsController.getAll)
blogsRouter.get(   param, blogsController.getOne)
blogsRouter.post(  root , blogsController.createBlog)
blogsRouter.put(   param, blogsController.updateBlogUsingId)
blogsRouter.patch( root , blogsController.deprecated)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)

export { blogsRouter }