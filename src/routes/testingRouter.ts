import { Router } from "express";
import { testingController} from "../controllers/testingController";

export const testingRouter = Router()
const root = '/'
const param = root + ':id'

testingRouter.delete(root,  testingController.clearAll)
testingRouter.delete(param, testingController.deprecated)
testingRouter.all('*', testingController.deprecated)