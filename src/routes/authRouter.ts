import { Router } from "express";
import { authController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";

const authRouter = Router()

authRouter.post('/login',...loginMiddleware, authController.login)

export { authRouter }