import { Router } from "express";
import blogsController from "../controllers/blogsController";
import { blogMiddlewares } from "../middleware/blogsMiddleware";
import { createPostForBlogMiddleware } from "../middleware/createPostForBlog";
import {getBlogsMiddleware} from "../middleware/getBlogsMiddleware";
import {getPostsByBlogMiddleware} from "../middleware/postsFromBlogs";
export const blogsRouter = Router()
const root = '/'
const param = root + ':id'
const postsByThis = param + '/posts'

blogsRouter.get(root, ...getBlogsMiddleware, blogsController.getBlogs)
blogsRouter.get(param, blogsController.getOne)
blogsRouter.get(postsByThis,...getPostsByBlogMiddleware, blogsController.getBlogsPost)
blogsRouter.post(postsByThis,...createPostForBlogMiddleware, blogsController.createPostForThisBlog)
blogsRouter.post(root, ...blogMiddlewares , blogsController.createBlog)
blogsRouter.put(param, ...blogMiddlewares, blogsController.updateBlogUsingId)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)
blogsRouter.patch(root, blogsController.deprecated)
blogsRouter.patch(param, blogsController.deprecated)