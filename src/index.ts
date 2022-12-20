import * as dotenv from 'dotenv'
dotenv.config()
import app from "./app";
import { runDb } from "./repositories/connectorCreater";

const port = process.env.PORT ?? 8000;

async function start() {
    const res = await runDb()
    const secret = process.env.JWT_SECRET && true
    if(res && secret) {
        app.listen(port,() => console.log('Server is running on port\n' + port))
    } else {
        throw new Error("failed to connect database")
    }
}

start()