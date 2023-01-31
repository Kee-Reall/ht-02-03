import {Router} from "express";
import {securityController} from "../controllers/securityController";

export const securityRouter = Router()

securityRouter.get('/devices',securityController.getAllSessions)
securityRouter.delete('/devices',)
securityRouter.delete('/devices/:deviceId',)

