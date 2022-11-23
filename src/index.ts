import app from "./app";
const port = process.env.port ?? 3000

console.log(32)

app.listen(port,() => console.info('Server is running on port\n' + port))