import { Router } from "express";
import { testingController} from "../controllers/testingController";
export const testingRouter = Router()

testingRouter.delete('/all-data',  testingController.clearAll)