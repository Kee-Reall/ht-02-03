import {Request, Response} from "express"
import {httpStatus} from "../enums/httpEnum"
import {authService} from "../services/auth-Service";
import {jwtService} from "../services/jwt-service";
import {tokenPair} from "../models/mixedModels";

class AuthController {
    async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const loginResult = await authService.login(loginOrEmail, password)
        if (!loginResult) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const tokenPair = await jwtService.createTokenPair(loginResult.id,loginResult.refreshTokens.current)
        if(!tokenPair){
            return res.sendStatus(httpStatus.teapot)
        }
        const { refreshToken, accessToken} = tokenPair
        res.status(httpStatus.ok)
            .cookie('refreshToken', refreshToken, {httpOnly:true,secure: true} )
            .json({accessToken})
    }

    async getUserFromRequest(req: Request, res: Response) { // required jwt middleware
        const {user: {login, email, id: userId}} = req
        res.status(httpStatus.ok).json({login, email, userId})
    }

    async registration(req: Request, res: Response) {
        const result = await authService.registration(req.body)
        res.sendStatus(result? httpStatus.noContent : httpStatus.teapot)
    }

    async conformation(req: Request, res: Response) {
        const confirmSuccess = await authService.conformation(req.body.code)
        if(!confirmSuccess){
            return res.status(httpStatus.badRequest).json({"errorsMessages": [
                    {
                        "message": "If the confirmation code is expired or already been applied",
                        "field": "code"
                    }
                ]})
        }
        res.sendStatus(httpStatus.noContent)
    }

    async resending(req: Request,res: Response) {
        const isResent = await authService.resendEmail(req.body.email)
        res.sendStatus(isResent ? httpStatus.noContent : httpStatus.teapot)
    }

    async refresh(req: Request, res: Response) {
        const {cookies:{refreshToken}} = req
        const user = await jwtService.getUserByToken(refreshToken)
        if(!user) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const pair: tokenPair | null  = await authService.refresh(user.id, refreshToken)
        if(!pair) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok)
            .cookie('refreshToken', pair!.refreshToken,{httpOnly: true, secure: true})
            .json({accessToken: pair!.accessToken})
    }

    async logout(req: Request, res: Response) {
        const {cookies:{refreshToken}} = req
        const user = await jwtService.getUserByToken(refreshToken)
        if (!user) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const result = await authService.logout(user.id,refreshToken,user.refreshTokens)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.notAuthorized)
    }
}

export const authController = new AuthController()