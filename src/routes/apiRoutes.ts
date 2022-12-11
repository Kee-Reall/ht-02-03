import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuthWithoutGet } from "../middleware/basicAuthWithoutGet";
import {testingRouter} from "./testingRouter";
import {basicAuth} from "../middleware/basicAuth";
const apiRouter = Router()

apiRouter.use('/blogs',basicAuthWithoutGet,blogsRouter)
apiRouter.use('/posts',basicAuthWithoutGet,postsRouter)
apiRouter.use('/users',basicAuth,)
apiRouter.use('/testing', testingRouter)

export { apiRouter }