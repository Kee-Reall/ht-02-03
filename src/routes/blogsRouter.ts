import { Router } from "express";
import {blogContainer} from "../containers/blogContainer";
import { blogMiddlewares } from "../middleware/blogsMiddleware";
import { createPostForBlogMiddleware } from "../middleware/createPostForBlog";
import {getPostsByBlogMiddleware} from "../middleware/postsFromBlogs";
import {BlogsController} from "../controllers/blogsController";
export const blogsRouter = Router()
const root = '/'
const param = root + ':id'
const postsByThis = param + '/posts'

const blogsController = blogContainer.resolve(BlogsController)

blogsRouter.get(root, blogsController.getBlogs.bind(blogsController))
blogsRouter.get(param, blogsController.getOne.bind(blogsController))
blogsRouter.get(postsByThis,...getPostsByBlogMiddleware, blogsController.getBlogsPost.bind(blogsController))
blogsRouter.post(postsByThis,...createPostForBlogMiddleware, blogsController.createPostForThisBlog.bind(blogsController))
blogsRouter.post(root, ...blogMiddlewares , blogsController.createBlog.bind(blogsController))
blogsRouter.put(param, ...blogMiddlewares, blogsController.updateBlogUsingId.bind(blogsController))
blogsRouter.delete(param, blogsController.deleteBlogUsingId.bind(blogsController))
blogsRouter.patch(root, blogsController.deprecated.bind(blogsController))
blogsRouter.patch(param, blogsController.deprecated.bind(blogsController))