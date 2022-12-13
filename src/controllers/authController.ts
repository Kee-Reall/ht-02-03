import { Request, Response } from "express"
import { httpStatus } from "../enums/httpEnum"

class AuthController {
    async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const loginSuccess: boolean = authService.login()
        res.sendStatus(loginSuccess ? httpStatus.noContent : httpStatus.notAuthorized)
    }
}

export const authController = new AuthController()