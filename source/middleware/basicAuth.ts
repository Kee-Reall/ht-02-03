import { NextFunction, Request, Response } from "express";
import { httpMethod } from "../enums/httpEnum";

export const basicAuth = ({method, headers:{authorization}}: Request, res: Response, next: NextFunction) => {
    if(method === httpMethod.get) next()
    const
}