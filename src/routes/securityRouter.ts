import {Router} from "express";
import {securityController} from "../controllers/securityController";
import {isSessionExist} from "../middleware/isSessionExist";

export const securityRouter = Router()

securityRouter.get('/devices',securityController.getAllSessions)
securityRouter.delete('/devices',securityController.killOthersSessions)
securityRouter.delete('/devices/:deviceId',...isSessionExist,securityController.killSession)

