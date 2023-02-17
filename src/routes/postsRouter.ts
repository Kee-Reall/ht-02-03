import { Router } from "express";
import { postMiddlewares } from "../middleware/potstMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import { createCommentMiddlewares } from "../middleware/createCommentMiddleware";
import {basicAuth} from "../middleware/basicAuth";
import {getCommentsMiddleware} from "../middleware/getCommentsMiddleware";
import {iocContainer} from "../containers/iocContainer";
import {PostsController} from "../controllers/postsController";
import {jwtAuthWithoutBlock} from "../middleware/jwtAuthWithoutBlock";
import {likeMiddleWare} from "../middleware/likeMiddleWare";
export const postsRouter = Router()
const root: string = '/'
const param: string = root + ':id'
const comments: string = param + '/comments'
const like: string =  param + '/like-status'

const postsController = iocContainer.resolve(PostsController)

postsRouter.get(root,jwtAuthWithoutBlock, postsController.getPosts.bind(postsController))
postsRouter.get(param,jwtAuthWithoutBlock, postsController.getOne.bind(postsController))
postsRouter.post(root,basicAuth, ...postMiddlewares, postsController.createPost.bind(postsController))
postsRouter.put(param, basicAuth, ...postMiddlewares, postsController.updatePostUsingId.bind(postsController))
postsRouter.delete(param, basicAuth, postsController.deletePostUsingId.bind(postsController))
postsRouter.patch(root, postsController.deprecated.bind(postsController))
postsRouter.patch(param, postsController.deprecated.bind(postsController))
postsRouter.get(comments, jwtAuthWithoutBlock, ...getCommentsMiddleware, postsController.getCommentsForPost.bind(postsController))
postsRouter.post(comments, jwtAuth, ...createCommentMiddlewares, postsController.createCommentForPost.bind(postsController))
postsRouter.put(like, jwtAuth, ...likeMiddleWare, postsController.likePost.bind(postsController))