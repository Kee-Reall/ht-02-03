import {Request, Response} from "express";
import {injectable,inject} from "inversify";
import {httpStatus} from "../enums/httpEnum";
import {GetOutput} from "../models/ResponseModel";
import {UsersService} from "../services/users-service";
import {Normalizer} from "../helpers/normalizer";


@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) protected  usersService: UsersService,
        @inject(Normalizer) protected normalizer: Normalizer
    ) {}

    async getUsers(req: Request, res: Response) {
        const params = this.normalizer.normalizeUsersQuery(req.query)
        const result: GetOutput = await this.usersService.getUsers(params)
        res.status(httpStatus.ok).json(result)
    }

    async createUser({body}: Request, res: Response) {
        const result = await this.usersService.adminCreatingUser(body)
        if(result) {
            return res.status(httpStatus.created).json(result)
        }
        res.sendStatus(httpStatus.teapot)
    }

    async deleteUser(req: Request, res: Response) {
        const { params: { id }} = req
        const result = await this.usersService.deleteUser(id)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.notFound)
    }
}
