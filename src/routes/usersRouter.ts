import { Router } from "express";
import {usersController} from "../controllers/usersController";
import {createUserMiddleware} from "../middleware/createUserMiddleware";

export const usersRouter = Router()
const root = '/'
const param = root + ':id'
usersRouter.get(root, usersController.getUsers)
usersRouter.post(root, ...createUserMiddleware, usersController.createUser)
usersRouter.delete(param, usersController.deleteUser)