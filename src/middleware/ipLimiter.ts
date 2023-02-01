import {RequestHandler} from "express";
import {attemptsRepository} from "../repositories/attemptsRepository";
import {subSeconds} from "date-fns"
import {httpStatus} from "../enums/httpEnum";

export const ipLimiter: RequestHandler = async (req,res,next) => {
    const {ip, url} = req
    const endpointAndIp = ip + url
    const date = new Date(Date.now())
    await attemptsRepository.addNewAttempt({endpointAndIp,date: date.toISOString()})
    const limit: number = 5
    const tenSecAgo = subSeconds(date,10).toISOString()
    const shouldBlock = await attemptsRepository.getAttemptsCount(endpointAndIp,tenSecAgo) > limit
    if(shouldBlock){
        return res.sendStatus(httpStatus.tooManyRequests)
    }
    next()
}