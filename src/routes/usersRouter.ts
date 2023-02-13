import { Router } from "express";
import {createUserMiddleware} from "../middleware/createUserMiddleware";
import {userContainer} from "../containers/userContainer";
import {UsersController} from "../controllers/usersController";

const usersController = userContainer.resolve(UsersController)

export const usersRouter = Router()
const root = '/'
const param = root + ':id'
usersRouter.get(root, usersController.getUsers.bind(usersController))
usersRouter.post(root, ...createUserMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete(param, usersController.deleteUser.bind(usersController))