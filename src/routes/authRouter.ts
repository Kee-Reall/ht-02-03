import { Router } from "express";
import { AuthController } from "../controllers/authController";
import {loginMiddleware} from "../middleware/loginMiddleware";
import {jwtAuth} from "../middleware/jwtAuth";
import {createUserMiddleware} from "../middleware/createUserMiddleware";
import {conformationValidator} from "../middleware/conformationValidator";
import {resendValidator} from "../middleware/resendValidator";
import {refreshTokenValidator} from "../middleware/refreshTokenValidator";
import {ipLimiter} from "../middleware/ipLimiter";
import {emailValidator} from "../middleware/emailValidator";
import {newPasswordValidator} from "../middleware/newPasswordValidator";
import {iocContainer} from "../containers/iocContainer";

const authRouter = Router()
const authController = iocContainer.resolve(AuthController)

authRouter.post('/login',ipLimiter,...loginMiddleware, authController.login.bind(authController))
authRouter.post('/registration',ipLimiter,...createUserMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation',ipLimiter,...conformationValidator,authController.conformation.bind(authController))
authRouter.post('/registration-email-resending',ipLimiter,...resendValidator,authController.resending.bind(authController))
authRouter.post('/refresh-token',...refreshTokenValidator,authController.refresh.bind(authController))
authRouter.post('/logout',...refreshTokenValidator,authController.logout.bind(authController))
authRouter.get('/me', jwtAuth, authController.getUserFromRequest.bind(authController))
authRouter.post('/password-recovery',ipLimiter,...emailValidator,authController.recoverPassword.bind(authController))
authRouter.post('/new-password',ipLimiter,...newPasswordValidator,authController.confirmPasswordChange.bind(authController))

export { authRouter }