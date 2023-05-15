import type http from 'http';
import type ExtendedRequest from '../ExtendedRequest/ExtendedRequest.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Endpoint = Partial<{
	[key in HttpMethod]: (
		req: ExtendedRequest,
		res: http.ServerResponse
	) => Promise<void>;
}>;

export type Endpoints = Record<string, Endpoint>;
