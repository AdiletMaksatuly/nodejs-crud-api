import Router from '../Router/Router.js';

const appRouter = new Router();

appRouter.get('/', (req, res) => {
    res.end('Hello World! This is Node.js CRUD API');
});

export default appRouter;