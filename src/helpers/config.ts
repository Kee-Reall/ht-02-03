import {config} from 'dotenv'
import * as path from "path";

config({
    path: path.resolve('config.txt')
})

const dbRemote = process.env.dbRemote ?? undefined

const dbHost = process.env.dbHost ?? 'localhost'
const dbPort = process.env.dbPort ?? '27017'

export const port = process.env.port ?? 8000
export const dbURI = dbRemote ?? `mongodb://${dbHost}:${dbPort}`