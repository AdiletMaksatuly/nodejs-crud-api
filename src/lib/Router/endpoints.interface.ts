import type http from 'http';
import { type CustomRequest } from '../models/request.type.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Endpoint = Partial<{
	[key in HttpMethod]: (
		req: CustomRequest,
		res: http.ServerResponse
	) => Promise<void>;
}>;

export type Endpoints = Record<string, Endpoint>;
