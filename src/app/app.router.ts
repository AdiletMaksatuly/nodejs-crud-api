import { Router } from '../lib/index.js';

const appRouter = new Router();

appRouter.get('/', async (req, res) => {
	res.end('Hello World! This is Node.js CRUD API');
});

export default appRouter;
