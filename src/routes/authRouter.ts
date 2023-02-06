import { Router } from "express";
import { authController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import {createUserMiddleware} from "../middleware/createUserMiddleware";
import {conformationValidator} from "../middleware/conformationValidator";
import {resendValidator} from "../middleware/resendValidator";
import {refreshTokenValidator} from "../middleware/refreshTokenValidator";
import {ipLimiter} from "../middleware/ipLimiter";
import {emailValidator} from "../middleware/emailValidator";
import {newPasswordValidator} from "../middleware/newPasswordValidator";

const authRouter = Router()

authRouter.post('/login',ipLimiter,...loginMiddleware, authController.login)
authRouter.post('/registration',ipLimiter,...createUserMiddleware, authController.registration)
authRouter.post('/registration-confirmation',ipLimiter,...conformationValidator,authController.conformation)
authRouter.post('/registration-email-resending',ipLimiter,...resendValidator,authController.resending)
authRouter.post('/refresh-token',...refreshTokenValidator,authController.refresh)
authRouter.post('/logout',...refreshTokenValidator,authController.logout)
authRouter.get('/me', jwtAuth, authController.getUserFromRequest)
authRouter.post('/password-recovery',ipLimiter,...emailValidator,authController.recoverPassword)
authRouter.post('/new-password',ipLimiter,...newPasswordValidator,authController.confirmPasswordChange)

export { authRouter }