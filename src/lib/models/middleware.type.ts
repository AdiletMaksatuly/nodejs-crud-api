import type http from 'http';
import type ExtendedRequest from '../ExtendedRequest/ExtendedRequest.js';

export type Middleware = (
	req: ExtendedRequest,
	res: http.ServerResponse
) => void | Promise<void>;
