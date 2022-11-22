import { Router } from "express";

const postsRouter = Router()

const rootString = '/'

postsRouter.get(rootString,()=>{})
postsRouter.get(`${rootString}:id`,()=>{})
postsRouter.post(rootString,()=>{})
postsRouter.put(`${rootString}:id`,()=>{})
postsRouter.patch(`${rootString}:id`,()=>{})
postsRouter.delete(`${rootString}:id`,()=>{})

export {postsRouter}