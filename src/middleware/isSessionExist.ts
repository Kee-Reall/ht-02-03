import {RequestHandler} from "express";
import {param} from "express-validator";
import {QueryRepository} from "../repositories/queryRepository";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";
import {iocContainer} from "../containers/iocContainer";

export const isSessionExist: RequestHandler[] = [
    param('deviceId').custom(async (value: string) => {
        const queryRepository = iocContainer.resolve(QueryRepository)
        const session = await queryRepository.getSession(value)
        if (!session) {
            throw new Error('session does not exist')
        }
    }),
    hasError(httpStatus.notFound, false)
]