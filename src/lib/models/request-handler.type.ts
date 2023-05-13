import type http from 'http';
import { type CustomRequest } from './request.type.js';

export type RequestHandler = (
	req: CustomRequest,
	res: http.ServerResponse
) => Promise<void>;
