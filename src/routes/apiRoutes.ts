import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuth } from "../middleware/basicAuth";
import {testingRouter} from "./testingRouter";
const apiRouter = Router()

apiRouter.use('/blogs',basicAuth,blogsRouter)
apiRouter.use('/posts',basicAuth,postsRouter)
apiRouter.use('/testing', testingRouter)

export { apiRouter }