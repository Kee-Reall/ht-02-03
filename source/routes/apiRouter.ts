import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";

const apiRouter = Router()

apiRouter.all('/blogs', blogsRouter)
apiRouter.all('/posts', postsRouter)

export { apiRouter }