import {Request, Response} from "express"
import {httpStatus} from "../enums/httpEnum"
import {authService} from "../services/auth-Service";
import {jwtService} from "../services/jwt-service";
import {clientMeta, createTokenClientMeta, tokenPair} from "../models/mixedModels";
import {refreshTokenPayload} from "../models/refreshTokensMeta";
import {ForbiddenError} from "../services/users-service";

class AuthController {
    async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const user = await authService.login(loginOrEmail, password)
        if (!user || !user.confirmation.isConfirmed) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const meta: createTokenClientMeta = {
            userId: user.id,
            ip: `${req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip}`,
            title: req.headers['user-agent'] as string
        }
        const tokenPair = await jwtService.createNewTokenPair(meta)
        if(!tokenPair) {
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
        try {
            const result = await authService.registration(req.body)

            if(result.data) {
                res.send(result.data)
                return
            }

            res.status(result.error?.status).send(result.error?.message)

            res.sendStatus(result? httpStatus.noContent : httpStatus.teapot)
        } catch (error) {
            if(error instanceof ForbiddenError) {

            res.status(500).send(error.message)
            }
            else if(error instanceof differentError){
                res.status(418)  // etc
            }
            else {
                console.error("We dont know what type of error is it")
                res.sendStatus(505)
            }
        }
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
        const payload: refreshTokenPayload | null = await jwtService.verifyRefreshToken(refreshToken)
        if(!payload) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const meta: clientMeta = {
            userId: payload.userId,
            ip: `${req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip}`,
            updateDate: payload.updateDate,
            deviceId: payload.deviceId,
        }
        const pair: tokenPair | null  = await jwtService.updateTokenPair(meta)
        if(!pair) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok)
            .cookie('refreshToken', pair.refreshToken,{httpOnly: true, secure: true})
            .json({accessToken: pair.accessToken})
    }

    async logout(req: Request, res: Response) {
        const {cookies:{refreshToken}} = req
        const meta = await jwtService.verifyRefreshToken(refreshToken)
        if (!meta) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const result = await authService.logout(meta)
        if(!result) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.cookie('refreshToken','',{httpOnly: true, secure: true}).sendStatus(httpStatus.noContent)
    }
}

export const authController = new AuthController()