import type http from 'http';
import UsersService from './users.service.js';
import { type RequestHandler } from '../lib/models/request-handler.type.js';
import { type CustomRequest } from '../lib/models/request.type.js';
import * as uuid from 'uuid';
import { Controller, ERRORS } from '../lib/index.js';

interface UsersControllerEndpoints {
	getUsers: RequestHandler;
	getUser: RequestHandler;
	createUser: RequestHandler;
	updateUser: RequestHandler;
	deleteUser: RequestHandler;
}

class UsersController extends Controller implements UsersControllerEndpoints {
	public async getUsers(
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> {
		const users = await UsersService.find();

		res.end(users);
	}

	public getUser = async (
		req: CustomRequest,
		res: http.ServerResponse
	): Promise<void> => {
		if (!req.params?.id) throw new Error('No id provided');

		if (!uuid.validate(req.params.id)) {
			this.sendBadRequest(res, 'Invalid user id'); return;
		}

		try {
			const user = await UsersService.findById(req.params.id);

			res.end(user);
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.NOT_FOUND) {
				this.sendNotFound(res, error.message); return;
			}

			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR); 
		}
	};

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
