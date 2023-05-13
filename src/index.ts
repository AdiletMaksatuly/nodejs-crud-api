import * as dotenv from 'dotenv';
import {Server} from "./lib/index.js";
import {usersRouter} from "./users/index.js";
import appRouter from "./app/app.router.js";
import {json} from "./lib/middlewares/json.middleware.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const BASE_URL = '/api';

const server = new Server();

const registerRouter = server.registerRouter.bind(server, BASE_URL);

registerRouter(usersRouter);
registerRouter(appRouter);

server.use(json);

server.listen(PORT, () => console.log('Server is listening on port: ' + PORT));