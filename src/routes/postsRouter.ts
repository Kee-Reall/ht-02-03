import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import { createCommentMiddlewares } from "../middleware/createCommentMiddleware";
import {basicAuth} from "../middleware/basicAuth";
import {getCommentsMiddleware} from "../middleware/getCommentsMiddleware";
import {postContainer} from "../containers/postContainer";
import {PostsController} from "../controllers/postsController";
export const postsRouter = Router()
const root = '/'
const param = root + ':id'
const comments = param + '/comments'

const postsController = postContainer.resolve(PostsController)

postsRouter.get(root, postsController.getPosts.bind(postsController))
postsRouter.get(param, postsController.getOne.bind(postsController))
postsRouter.post(root, basicAuth, ...postMiddlewares, postsController.createPost.bind(postsController))
postsRouter.put(param, basicAuth, ...postMiddlewares, postsController.updatePostUsingId.bind(postsController))
postsRouter.delete(param, basicAuth,postsController.deletePostUsingId.bind(postsController))
postsRouter.patch(root  ,postsController.deprecated.bind(postsController))
postsRouter.patch(param, postsController.deprecated.bind(postsController))
postsRouter.get(comments, ...getCommentsMiddleware ,postsController.getCommentsForPost.bind(postsController))
postsRouter.post(comments, jwtAuth, ...createCommentMiddlewares, postsController.createCommentForPost.bind(postsController))