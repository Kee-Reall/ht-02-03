import * as dotenv from 'dotenv'
dotenv.config()
import app from "./app";
import { runDb } from "./dataLayer/dbCreate";

const port = process.env.PORT ?? 8000;

(async function() {
    await runDb()
    app.listen(port,() => console.log('Server is running on port\n' + port))
})()