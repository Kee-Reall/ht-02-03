import { Router } from "express";
import blogsController from "../controllers/blogsController";

const blogsRouter = Router()

const rootString = '/'

blogsRouter.get("/blogs",blogsController.getAll)
blogsRouter.get("/blogs/:id",blogsController.getOne)
blogsRouter.post(rootString,blogsController.createBlog)
blogsRouter.put(`${rootString}:id`,blogsController.updateBlogUsingId)
blogsRouter.patch(`${rootString}:id`,blogsController.deprecated)
blogsRouter.delete(`${rootString}:id`,blogsController.deleteBlogUsingId)

export {blogsRouter}