import * as dotenv from 'dotenv';
import Server from './Server.js';
import usersRouter from "./routers/users.router.js";
import appRouter from "./routers/app.router.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const BASE_URL = '/api';

const server = new Server();

const registerRouter = server.registerRouter.bind(server, BASE_URL);

registerRouter(usersRouter);
registerRouter(appRouter)

server.listen(PORT, () => console.log('Server is listening on port: ' + PORT));