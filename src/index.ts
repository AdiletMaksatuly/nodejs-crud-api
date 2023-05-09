import * as dotenv from 'dotenv';
import Server from './Server.js';
import usersRouter from "./routers/users.router.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = new Server();

server.registerRouter(usersRouter);

server.listen(PORT, () => console.log('Server is listening on port: ' + PORT));