import {Container} from "inversify";
import {TestingController} from "../controllers/testingController";
import {CommandRepository} from "../repositories/commandRepository";

export const mixedContainer = new Container()
mixedContainer.bind(TestingController).toSelf()
mixedContainer.bind(CommandRepository).toSelf()