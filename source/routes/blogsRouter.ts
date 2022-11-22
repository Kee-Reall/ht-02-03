import { Router } from "express";

const blogsRouter = Router()

const rootString = '/'

blogsRouter.get(rootString,()=>{})
blogsRouter.get(`${rootString}:id`,()=>{})
blogsRouter.post(rootString,()=>{})
blogsRouter.put(`${rootString}:id`,()=>{})
blogsRouter.patch(`${rootString}:id`,()=>{})
blogsRouter.delete(`${rootString}:id`,()=>{})

export {blogsRouter}