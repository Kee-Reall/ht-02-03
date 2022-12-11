import { Router } from "express";
import {usersController} from "../controllers/usersController";
import {createUserMiddleware} from "../middleware/createUserMiddleware";

export const usersRouter = Router()
const root = '/'
usersRouter.get(root, usersController.getUsers)
usersRouter.post(root, ...createUserMiddleware, usersController.createUser)
usersRouter.delete(root)