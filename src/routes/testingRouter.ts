import { Router } from "express";
import {iocContainer} from "../containers/iocContainer";
import {TestingController} from "../controllers/testingController";
export const testingRouter = Router()
const testingController = iocContainer.resolve(TestingController)

testingRouter.delete('/all-data',  testingController.clearAll.bind(testingController))