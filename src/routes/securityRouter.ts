import {Router} from "express";
import {SecurityController} from "../controllers/securityController";
import {isSessionExist} from "../middleware/isSessionExist";
import {userContainer} from "../containers/userContainer";

export const securityRouter = Router()
const securityController = userContainer.resolve(SecurityController)

securityRouter.get('/devices',securityController.getAllSessions.bind(securityController))
securityRouter.delete('/devices',securityController.killOthersSessions.bind(securityController))
securityRouter.delete('/devices/:deviceId',...isSessionExist,securityController.killSession.bind(securityController))

