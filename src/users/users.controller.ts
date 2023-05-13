import type http from 'http';
import UsersService from './users.service.js';
import { type RequestHandler } from '../lib/models/request-handler.type.js';
import { type CustomRequest } from '../lib/models/request.type.js';

interface UsersControllerEndpoints {
	getUsers: RequestHandler;
	getUser: RequestHandler;
	createUser: RequestHandler;
	updateUser: RequestHandler;
	deleteUser: RequestHandler;
}

class UsersController implements UsersControllerEndpoints {
	public async getUsers(
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> {
		const users = await UsersService.find();

		res.end(users);
	}

	public async getUser(req: CustomRequest, res: http.ServerResponse) {
		res.end('GET users/:id');
	}

	public async createUser(
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> {
		res.end('POST users/');
	}

	public async updateUser(
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> {
		res.end('PUT users/:id');
	}

	public async deleteUser(
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> {
		res.end('DELETE users/:id');
	}
}

export default new UsersController();
