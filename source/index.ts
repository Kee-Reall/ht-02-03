import app from "./app";
const port = process.env.port ?? 3000

app.listen(port,() => console.info('Server is running on port\n' + port))