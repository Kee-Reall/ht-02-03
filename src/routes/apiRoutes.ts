import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuth } from "../middleware/basicAuth";
import { trimBodyStrings } from "../middleware/trimBodyStrings";

const apiRouter = Router()

apiRouter.use(basicAuth)
//apiRouter.use(trimBodyStrings)

apiRouter.use('/blogs',blogsRouter)
apiRouter.use('/posts',postsRouter)

export { apiRouter }