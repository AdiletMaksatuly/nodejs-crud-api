import {Router} from "../lib/index.js";
import UsersController from "./users.controller.js";

const usersRouter = new Router();

usersRouter.get('/users', (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.end('GET users/');
});

export default usersRouter;