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
}

const testingController = new TestingController()
export { testingController }