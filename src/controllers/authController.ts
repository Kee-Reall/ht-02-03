import {Request, Response} from "express"
import {httpStatus} from "../enums/httpEnum"
import {authService} from "../services/auth-Service";
import {jwtService} from "../services/jwt-service";
import {userLogicModel} from "../models/userModel";

class AuthController {
    async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const loginResult: userLogicModel | null = await authService.login(loginOrEmail, password)
        if (!loginResult) {
            res.sendStatus(httpStatus.notAuthorized)
            return
        }
        const accessToken = await jwtService.createToken(loginResult.id)
        res.status(httpStatus.ok).json({accessToken})
    }

    async getUserFromRequest(req: Request, res: Response) { // required jwt middleware
        const {login, email, id: userId} = req.user!
        res.status(httpStatus.ok).json({login, email, userId})
    }

    async registration(req: Request, res: Response) {
        const result = await authService.registration()

    }

    async conformation(req: Request, res: Response) {

    }
}

export const authController = new AuthController()