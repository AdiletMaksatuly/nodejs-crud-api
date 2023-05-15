import { Router } from '../lib/index.js';
import UsersController from './users.controller.js';

const usersRouter = new Router();

usersRouter.get('/users', UsersController.getUsers);

usersRouter.get('/users/:id', UsersController.getUser);

usersRouter.post('/users', UsersController.createUser);

usersRouter.put('/users/:id', UsersController.updateUser);

usersRouter.delete('/users/:id', UsersController.deleteUser);

export default usersRouter;
