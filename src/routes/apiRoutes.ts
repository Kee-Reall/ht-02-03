import { Router } from "express";
import { blogsRouter } from "./blogsRouter";
import { postsRouter } from "./postsRouter";
import { basicAuthWithoutGet } from "../middleware/basicAuthWithoutGet";
import {testingRouter} from "./testingRouter";
import {basicAuth} from "../middleware/basicAuth";
import {usersRouter} from "./usersRouter";
import {authRouter} from "./authRouter"
import {commentsRouter} from "./commentsRouter";
import {mailWorker} from "../repositories/mailWorker";
const apiRouter = Router()

apiRouter.use('/blogs',basicAuthWithoutGet,blogsRouter)
apiRouter.use('/posts',postsRouter)
apiRouter.use('/users',basicAuth,usersRouter)
apiRouter.use('/auth',authRouter)
apiRouter.use('/testing', testingRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.get('/email-secret',
    async (req, res)=> {
        res.status(218).json(await mailWorker.testingMessage())
})

export { apiRouter }