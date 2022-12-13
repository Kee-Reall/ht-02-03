import { Request, Response } from "express"
import { httpStatus } from "../enums/httpEnum"
import {authService} from "../services/auth-Service";

class AuthController {
    async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const loginSuccess: boolean = await authService.login(loginOrEmail, password)
        res.sendStatus(loginSuccess ? httpStatus.noContent : httpStatus.notAuthorized)
    }
}

export const authController = new AuthController()