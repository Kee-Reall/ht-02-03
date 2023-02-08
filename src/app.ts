import express from 'express'
import {apiRouter} from "./routes/apiRoutes";
import cookiesParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: ["http://localhost:3000"]
}))
app.use(express.json())
app.use(cookiesParser())
app.set('trust-proxy', true)
app.use('/api',apiRouter)

export default app