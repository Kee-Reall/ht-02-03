import {inject, injectable} from "inversify";
import {Request, Response, CookieOptions} from "express"
import {httpStatus} from "../enums/httpEnum"
import {AuthService} from "../services/auth-Service";
import {JwtService} from "../services/jwt-service";
import {ClientMeta, CreateTokenClientMeta, TokenPair} from "../models/mixedModels";
import {RefreshTokenPayload} from "../models/refreshTokensMeta";
import {UsersService} from "../services/users-service";

@injectable()
export class AuthController {
    private cookiesOptions: CookieOptions = {
        domain: 'ht-02-03.vercel.app',
        sameSite: 'none',
        secure: true,
        httpOnly: true
    }

    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(AuthService) protected authService: AuthService,
        @inject(JwtService) protected jwtService: JwtService
    ) {
    }

    public async login(req: Request, res: Response) {
        const {body: {loginOrEmail, password}} = req
        const user = await this.authService.login(loginOrEmail, password)
        if (!user || !user.confirmation.isConfirmed) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const meta: CreateTokenClientMeta = {
            userId: user.id,
            ip: `${req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip}`,
            title: req.headers['user-agent'] as string
        }
        const tokenPair = await this.jwtService.createTokenPair(meta)
        if (!tokenPair) {
            return res.sendStatus(httpStatus.teapot)
        }
        const {refreshToken, accessToken} = tokenPair
        res.status(httpStatus.ok)
            .cookie('refreshToken', refreshToken, this.cookiesOptions)
            .json({accessToken})
    }

    public async getUserFromRequest(req: Request, res: Response) { // required jwt middleware
        const {user: {login, email, id: userId}} = req
        res.status(httpStatus.ok).json({login, email, userId})
    }

    public async registration(req: Request, res: Response) {
        const result = await this.authService.registration(req.body)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.teapot)
    }

    public async conformation(req: Request, res: Response) {
        const confirmSuccess = await this.authService.conformation(req.body.code)
        if (!confirmSuccess) {
            return res.status(httpStatus.badRequest).json({
                "errorsMessages": [
                    {
                        "message": "If the confirmation code is expired or already been applied",
                        "field": "code"
                    }
                ]
            })
        }
        res.sendStatus(httpStatus.noContent)
    }

    public async resending(req: Request, res: Response) {
        const isResent = await this.authService.resendEmail(req.body.email)
        res.sendStatus(isResent ? httpStatus.noContent : httpStatus.teapot)
    }

    public async refresh(req: Request, res: Response) {
        const {cookies: {refreshToken}} = req
        const payload: RefreshTokenPayload | null = await this.jwtService.verifyRefreshToken(refreshToken)
        if (!payload) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const meta: ClientMeta = {
            userId: payload.userId,
            ip: `${req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip}`,
            updateDate: payload.updateDate,
            deviceId: payload.deviceId,
        }
        const pair: TokenPair | null = await this.jwtService.updateTokenPair(meta)
        if (!pair) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.status(httpStatus.ok)
            .cookie('refreshToken', pair.refreshToken, this.cookiesOptions)
            .json({accessToken: pair.accessToken})
    }

    public async logout(req: Request, res: Response) {
        const {cookies: {refreshToken}} = req
        const meta = await this.jwtService.verifyRefreshToken(refreshToken)
        if (!meta) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        const result = await this.authService.logout(meta)
        if (!result) {
            return res.sendStatus(httpStatus.notAuthorized)
        }
        res.cookie('refreshToken', '', this.cookiesOptions).sendStatus(httpStatus.noContent)
    }

    public async recoverPassword(req: Request, res: Response) {
        const {body: {email}} = req
        await this.usersService.recoverPassword(email)
        res.sendStatus(httpStatus.noContent)
    }

    public async confirmPasswordChange(req: Request, res: Response) {
        const {body: {newPassword, recoveryCode}} = req
        const isPasswordChanged: boolean = await this.usersService.confirmRecovery(recoveryCode, newPassword)
        if (isPasswordChanged) {
            return res.sendStatus(httpStatus.noContent)
        }
        res.status(httpStatus.badRequest).json({
            "errorsMessages": [
                {
                    message: "If the confirmation code is expired or already been applied",
                    field: "recoveryCode"
                }
            ]
        })
    }
}