import { Router } from "express";
import {iocContainer} from "../containers/iocContainer";
import { blogMiddlewares } from "../middleware/blogsMiddleware";
import { createPostForBlogMiddleware } from "../middleware/createPostForBlog";
import {getPostsByBlogMiddleware} from "../middleware/postsFromBlogs";
import {BlogsController} from "../controllers/blogsController";
import {jwtAuthWithoutBlock} from "../middleware/jwtAuthWithoutBlock";
export const blogsRouter = Router()
const root = '/'
const param = root + ':id'
const postsByThis = param + '/posts'

const blogsController = iocContainer.resolve(BlogsController)

blogsRouter.get(root, blogsController.getBlogs.bind(blogsController))
blogsRouter.get(param, blogsController.getOne.bind(blogsController))
blogsRouter.get(postsByThis,jwtAuthWithoutBlock,...getPostsByBlogMiddleware, blogsController.getBlogsPost.bind(blogsController))
blogsRouter.post(postsByThis,...createPostForBlogMiddleware, blogsController.createPostForThisBlog.bind(blogsController))
blogsRouter.post(root, ...blogMiddlewares , blogsController.createBlog.bind(blogsController))
blogsRouter.put(param, ...blogMiddlewares, blogsController.updateBlogUsingId.bind(blogsController))
blogsRouter.delete(param, blogsController.deleteBlogUsingId.bind(blogsController))
blogsRouter.patch(root, blogsController.deprecated.bind(blogsController))
blogsRouter.patch(param, blogsController.deprecated.bind(blogsController))