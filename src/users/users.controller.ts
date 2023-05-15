import type http from 'http';
import UsersService from './users.service.js';
import { type RequestHandler } from '../lib/models/request-handler.type.js';
import * as uuid from 'uuid';
import { Controller, ERRORS, type ExtendedRequest } from '../lib/index.js';

interface UsersControllerEndpoints {
	getUsers: RequestHandler;
	getUser: RequestHandler;
	createUser: RequestHandler;
	updateUser: RequestHandler;
	deleteUser: RequestHandler;
}

class UsersController extends Controller implements UsersControllerEndpoints {
	public getUsers = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		try {
			const users = await UsersService.find();

			res.end(users);
		} catch (error: unknown) {
			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR);
			throw error;
		}
	};

	public getUser = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		if (!req.params?.id) throw new Error('No id provided');

		if (!uuid.validate(req.params.id)) {
			this.sendBadRequest(res, 'Invalid user id');
			return;
		}

		try {
			const user = await UsersService.findById(req.params.id);

			res.end(user);
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.NOT_FOUND) {
				this.sendNotFound(res, error.message);
				return;
			}

			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR);
			throw error;
		}
	};

	public createUser = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		const userToCreate: unknown = JSON.parse(req.body);

		try {
			const createdUser = await UsersService.createUser(userToCreate);

			this.sendPostOk(res, createdUser);
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.BAD_REQUEST) {
				this.sendBadRequest(res, error.message);
				return;
			}

			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR);
			throw error;
		}
	};

	public updateUser = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		if (!req.params?.id) throw new Error('No id provided');

		if (!uuid.validate(req.params.id)) {
			this.sendBadRequest(res, 'Invalid user id');
			return;
		}

		const userToUpdate: unknown = JSON.parse(req.body);

		try {
			const updatedUser = await UsersService.findByIdAndUpdate(
				req.params.id,
				userToUpdate
			);

			res.end(updatedUser);
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.BAD_REQUEST) {
				this.sendBadRequest(res, error.message);
				return;
			}

			if (error instanceof Error && error.message === ERRORS.NOT_FOUND) {
				this.sendNotFound(res, error.message);
				return;
			}

			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR);
			throw error;
		}
	};

	public deleteUser = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		if (!req.params?.id) throw new Error('No id provided');

		if (!uuid.validate(req.params.id)) {
			this.sendBadRequest(res, 'Invalid user id');
			return;
		}

		try {
			await UsersService.findByIdAndDelete(req.params.id);

			this.sendDeleteOk(res);
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.NOT_FOUND) {
				this.sendNotFound(res, error.message);
				return;
			}

			this.sendInternalServerError(res, ERRORS.INTERNAL_SERVER_ERROR);
			throw error;
		}
	};
}

export default new UsersController();
