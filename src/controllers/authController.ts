import { Request, Response } from "express"
import { httpStatus } from "../enums/httpEnum"
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
        const accessToken = jwtService.createToken(loginResult.id)
        res.status(httpStatus.ok).send({accessToken})
    }

    async getUserByJWT(req: Request, res: Response) {
        console.log('test1')
    }
}

export const authController = new AuthController()