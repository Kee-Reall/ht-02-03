import * as dotenv from 'dotenv'
dotenv.config()
import app from "./app";
import { runDb } from "./adapters/mongoConnectorCreater";

const port = process.env.PORT ?? 8000;

async function start() {
    const isDbAvailable = await runDb()
    const hasJwtSecret = process.env.JWT_SECRET && true
    if(isDbAvailable && hasJwtSecret) {
        app.listen(port,() => console.log('Server is running on port\n' + port))
    } else {
        throw new Error("failed to connect database")
    }
}

start()