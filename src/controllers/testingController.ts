import {store} from "../dataLayer/store";
import {Request, Response} from "express";
import {httpStatus} from "../enums/httpEnum";

class TestingController {
    constructor() {
    }

    async clearAll(req: Request, res: Response){
        store.clearStore()
        res.sendStatus(httpStatus.noContent)
    }

    async deprecated(req: Request, res: Response){
        res.sendStatus(httpStatus.deprecated)
    }
}

const testingController = new TestingController()
export { testingController }