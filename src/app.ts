import express from 'express'
import {apiRouter} from "./routes/apiRoutes";
import cookiesParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookiesParser())
app.set('trust-proxy', true)
app.use('/api',apiRouter)

export default app