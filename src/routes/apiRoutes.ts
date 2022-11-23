import { Router } from "express";
import {blogsRouter} from "./blogsRouter";
import {postsRouter} from "./postsRouter";
import {basicAuth} from "../middleware/basicAuth";

export const apiRouter = Router()

apiRouter.use(basicAuth)


apiRouter.all('/blogs',blogsRouter)
apiRouter.all('/posts',postsRouter)