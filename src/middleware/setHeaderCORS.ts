import {RequestHandler} from "express";

const setHeaderCORS: RequestHandler = (req, res, next) => {//not use for now
    const {ip} = req
    next()
}