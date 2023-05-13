import Router from '../Router/Router.js';
import http from "http";

const usersRouter = new Router();

usersRouter.get('/users', (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.end('GET users/');
});

export default usersRouter;