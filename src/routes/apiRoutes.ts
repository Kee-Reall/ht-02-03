import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuthWithoutGet } from "../middleware/basicAuthWithoutGet";
import {testingRouter} from "./testingRouter";
import {basicAuth} from "../middleware/basicAuth";
import {usersRouter} from "./usersRouter";
import {authRouter} from "./authRouter"
const apiRouter = Router()

apiRouter.use('/blogs',basicAuthWithoutGet,blogsRouter)
apiRouter.use('/posts',basicAuthWithoutGet,postsRouter)
apiRouter.use('/users',basicAuth,usersRouter)
apiRouter.use('/auth',authRouter)
apiRouter.use('/testing', testingRouter)

export { apiRouter }