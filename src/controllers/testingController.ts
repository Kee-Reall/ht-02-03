import {CommandRepository} from "../repositories/commandRepository";
import { Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";
import {injectable, inject} from "inversify";

@injectable()
export class TestingController {

    constructor(
        @inject(CommandRepository) protected commandRepository: CommandRepository
    ) {}

    async clearAll(req: Request, res: Response){
        res.sendStatus(httpStatus.noContent)
        await this.commandRepository.clearStore()
    }
}