import Router from '../Router/Router.js';
import http from "http";

const usersRouter = new Router();

usersRouter.get('/', (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.end('GET /');
});

export default usersRouter;