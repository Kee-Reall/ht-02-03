import {Router} from "express";
import {SecurityController} from "../controllers/securityController";
import {isSessionExist} from "../middleware/isSessionExist";
import {iocContainer} from "../containers/iocContainer";

export const securityRouter = Router()
const securityController = iocContainer.resolve(SecurityController)

securityRouter.get('/devices',securityController.getAllSessions.bind(securityController))
securityRouter.delete('/devices',securityController.killOthersSessions.bind(securityController))
securityRouter.delete('/devices/:deviceId',...isSessionExist,securityController.killSession.bind(securityController))

