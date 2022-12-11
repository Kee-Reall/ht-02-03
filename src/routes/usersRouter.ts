import { Router } from "express";

export const usersRouter = Router()
const root = '/'
usersRouter.get(root)
usersRouter.post(root)
usersRouter.delete(root)