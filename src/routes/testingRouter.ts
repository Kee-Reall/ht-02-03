import { Router } from "express";
import {mixedContainer} from "../containers/mixedContainer";
import {TestingController} from "../controllers/testingController";
export const testingRouter = Router()
const testingController = mixedContainer.resolve(TestingController)

testingRouter.delete('/all-data',  testingController.clearAll.bind(testingController))