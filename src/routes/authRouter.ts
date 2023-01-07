import { Router } from "express";
import { authController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";

const authRouter = Router()

authRouter.post('/login',...loginMiddleware, authController.login)
authRouter.get('/me', jwtAuth, authController.getUserFromRequest)

export { authRouter }