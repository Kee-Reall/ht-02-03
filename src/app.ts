import express from 'express'
import {apiRouter} from "./routes/apiRoutes";
import cookiesParser from 'cookie-parser'
export const app = express()
app.use(express.json())
app.use(cookiesParser())
app.use('/api',apiRouter)
