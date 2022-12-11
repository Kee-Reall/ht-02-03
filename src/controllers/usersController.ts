import {Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {normalizeUsersQuery} from "../helpers/normalizeUsersQuery";
import {getOutput} from "../models/ResponseModel";
import {usersService} from "../services/users-service";

class UsersController {
    async getUsers(req: Request, res: Response) {
        const params = normalizeUsersQuery(req.query)
        const result: getOutput = await usersService.getUsers(params)
        res.status(httpStatus.ok).json(result)
    }

    async createUser(req: Request, res: Response) {

    }

    async deleteUser(req: Request, res: Response) {

    }

}