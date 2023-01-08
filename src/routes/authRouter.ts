import { Router } from "express";
import { authController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import {createUserMiddleware} from "../middleware/createUserMiddleware";

const authRouter = Router()

authRouter.post('/login',...loginMiddleware, authController.login)
authRouter.post('/registration',...createUserMiddleware, authController.registration)
authRouter.post('/registration-confirmation',authController.conformation)
authRouter.post('/registration-email-resending')
authRouter.get('/me', jwtAuth, authController.getUserFromRequest)

export { authRouter }