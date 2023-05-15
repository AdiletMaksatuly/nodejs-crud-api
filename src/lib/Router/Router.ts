import { type Endpoints, type HttpMethod } from './endpoints.interface.js';
import { type RequestHandler } from '../models/request-handler.type.js';

export default class Router {
	private readonly endpoints: Endpoints;

	constructor() {
		this.endpoints = {};
	}

	public getEndpoints(): Endpoints {
		return this.endpoints;
	}

	private addEndpoint(
		method: HttpMethod,
		path: string,
		handler: RequestHandler
	): void {
		if (!this.endpoints[path]) {
			this.endpoints[path] = {};
		}

		const endpoint = this.endpoints[path];

		if (endpoint[method]) {
			throw new Error(`Endpoint ${path} already exists for method ${method}`);
		}

		endpoint[method] = handler;
	}

	public get(path: string, handler: RequestHandler): void {
		this.addEndpoint('GET', path, handler);
	}

	public post(path: string, handler: RequestHandler): void {
		this.addEndpoint('POST', path, handler);
	}

	public put(path: string, handler: RequestHandler): void {
		this.addEndpoint('PUT', path, handler);
	}

	public delete(path: string, handler: RequestHandler): void {
		this.addEndpoint('DELETE', path, handler);
	}
}
