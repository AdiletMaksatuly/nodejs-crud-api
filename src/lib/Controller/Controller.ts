import type http from 'http';
import { ERRORS } from '../constants/errors.const.js';

export default class Controller {
	public sendBadRequest = (res: http.ServerResponse, message: string): void => {
		res.writeHead(400, ERRORS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
		res.end(message);
	};

	public sendNotFound = (res: http.ServerResponse, message: string): void => {
		res.writeHead(404, ERRORS.NOT_FOUND, { 'Content-Type': 'text/plain' });
		res.end(message);
	};

	public sendInternalServerError = (
		res: http.ServerResponse,
		message: string
	): void => {
		res.writeHead(500, ERRORS.INTERNAL_SERVER_ERROR, {
			'Content-Type': 'text/plain',
		});
		res.end(message);
	};
}
