import express from 'express'
import {apiRouter} from "./routes/apiRoutes";
import cookiesParser from 'cookie-parser'
//import cors from 'cors'

const app = express()
/*app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
})) */

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())
app.use(cookiesParser())
app.set('trust-proxy', true)
app.use('/api',apiRouter)

export default app