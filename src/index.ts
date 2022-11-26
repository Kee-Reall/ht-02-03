import app from "./app";
import { port } from "./helpers/config";

app.listen(port,() => console.log('Server is running on port\n' + port))