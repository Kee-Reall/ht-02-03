import { Router } from "express";
import {createUserMiddleware} from "../middleware/createUserMiddleware";
import {iocContainer} from "../containers/iocContainer";
import {UsersController} from "../controllers/usersController";

const usersController = iocContainer.resolve(UsersController)

export const usersRouter = Router()
const root = '/'
const param = root + ':id'
usersRouter.get(root, usersController.getUsers.bind(usersController))
usersRouter.post(root, ...createUserMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete(param, usersController.deleteUser.bind(usersController))