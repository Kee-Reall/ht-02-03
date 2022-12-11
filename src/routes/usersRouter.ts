import { Router } from "express";
import {usersController} from "../controllers/usersController";

export const usersRouter = Router()
const root = '/'
usersRouter.get(root, usersController.getUsers)
usersRouter.post(root)
usersRouter.delete(root)