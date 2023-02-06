import * as dotenv from 'dotenv'
dotenv.config()
import app from "./app";
import {mRunDb} from "./adapters/mongooseCreater";

const port = process.env.PORT ?? 8000;

async function start() {
    const isMongooseReady = await mRunDb()
    const hasJwtSecret = process.env.JWT_SECRET && true
    if(hasJwtSecret && isMongooseReady) {
        app.listen(port,() => console.log('Server is running on port\n' + port))
    } else {
        throw new Error("failed to connect database")
    }
}

start()