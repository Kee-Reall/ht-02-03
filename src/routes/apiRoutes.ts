import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuth } from "../middleware/basicAuth";

const apiRouter = Router()

apiRouter.use(basicAuth)

apiRouter.use('/blogs',blogsRouter)
apiRouter.use('/posts',postsRouter)

export { apiRouter }