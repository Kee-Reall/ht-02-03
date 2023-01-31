import {RequestHandler} from "express";
import {param} from "express-validator";
import {queryRepository} from "../repositories/queryRepository";
import {hasError} from "./hasError";
import {httpStatus} from "../enums/httpEnum";

export const isSessionExist: RequestHandler[] = [
    param('deviceId').custom( async (value: string) => {
        const session = await queryRepository.getSession(value)
        if(!session) {
            throw new Error('session does not exist')
        }
    }),
    hasError(httpStatus.notFound)
]