import express, {Request, Response} from 'express'
import { httpStatus } from './enums/httpEnum'
import { apiRouter } from './routes/apiRouter'

const app = express()

app.use(express.json())

app.use(apiRouter)

export default app