import { Router } from "express";
import { authController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import {createUserMiddleware} from "../middleware/createUserMiddleware";
import {conformationValidator} from "../middleware/conformationValidator";
import {resendValidator} from "../middleware/resendValidator";
import {refreshTokenValidator} from "../middleware/refreshTokenValidator";

const authRouter = Router()

authRouter.post('/login',...loginMiddleware, authController.login)
authRouter.post('/registration',...createUserMiddleware, authController.registration)
authRouter.post('/registration-confirmation',...conformationValidator,authController.conformation)
authRouter.post('/registration-email-resending',...resendValidator,authController.resending)
authRouter.post('/refresh-token',...refreshTokenValidator,authController.refresh)
authRouter.post('/logout',...refreshTokenValidator,authController.logout)
authRouter.get('/me', jwtAuth, authController.getUserFromRequest)

export { authRouter }