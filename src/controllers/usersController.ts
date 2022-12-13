import {Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";
import {normalizeUsersQuery} from "../helpers/normalizeUsersQuery";
import {getOutput} from "../models/ResponseModel";
import {usersService} from "../services/users-service";

class UsersController {
    async getUsers(req: Request, res: Response) {
        const {query: inputParams} = req
        const params = normalizeUsersQuery(inputParams)
        const result: getOutput = await usersService.getUsers(params)
        res.status(httpStatus.ok).json(result)
    }

    async createUser(req: Request, res: Response) {
        const {body: data} = req
        const result = await usersService.createUser(data)
        if(result) {
            res.status(httpStatus.created).json(result)
            return
        }
        res.sendStatus(httpStatus.teapot)
    }

    async deleteUser(req: Request, res: Response) {
        const { params: { id }} = req
        const result = await usersService.deleteUser(id)
        res.sendStatus(result ? httpStatus.noContent : httpStatus.notFound)
    }

}

export const usersController = new UsersController()