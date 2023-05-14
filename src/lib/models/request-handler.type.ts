import type http from 'http';
import type ExtendedRequest from '../ExtendedRequest/ExtendedRequest.js';

export type RequestHandler = (
	req: ExtendedRequest,
	res: http.ServerResponse
) => Promise<void>;
