import { commandRepository } from "../repositories/commandRepository";
import { Request, Response } from "express";
import { httpStatus } from "../enums/httpEnum";

class TestingController {

    async clearAll(req: Request, res: Response){
        commandRepository.clearStore().finally(() => res.sendStatus(httpStatus.noContent))
    }
}

const testingController = new TestingController()
export { testingController }