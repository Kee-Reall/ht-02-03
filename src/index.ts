import app from "./app";
import * as dotenv from 'dotenv'
import { runDb } from "./dataLayer/dbCreate";
dotenv.config()

const port = process.env.PORT ?? 8000;

(async function() {
    await runDb()
    app.listen(port,() => console.log('Server is running on port\n' + port))
})()