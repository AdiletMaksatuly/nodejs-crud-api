import http from 'http';
import { type Router } from '../Router/index.js';
import EventEmitter from 'events';
import { keys } from '../../utils/keys.util.js';
import {
	type Endpoint,
	type Endpoints,
	type HttpMethod,
} from '../Router/endpoints.interface.js';
import { type Middleware } from '../models/middleware.type.js';
import { ERRORS } from '../constants/errors.const.js';
import { ExtendedRequest } from '../ExtendedRequest/index.js';

export default class Server extends EventEmitter {
	private readonly server: http.Server;

	private allEndpoints: Endpoints = {};

	private readonly middlewares: Middleware[] = [];

	constructor() {
		super();

		this.server = http.createServer(
			{
				IncomingMessage: ExtendedRequest,
			},
			(req, res) => {
				this.setRequestListeners(req, res);
				this.handleRequest(req, res).catch((error) =>
					this.emit('error', error)
				);
			}
		);

		this.setListeners();
	}

	public listen(port: number | string, callback: () => void): void {
		this.server.listen(+port, callback);
	}

	public use(middleware: Middleware): void {
		this.middlewares.push(middleware);
	}

	public registerRouter(baseURL: string, router: Router): void {
		const endpoints = router.getEndpoints();

		const setEndpointEvent = this.setEndpointEvent.bind(this, baseURL);

		keys(endpoints).forEach((path) => {
			keys(endpoints[path]).forEach((method) => {
				setEndpointEvent(endpoints[path], path, method);
			});
		});

		this.allEndpoints = {
			...this.allEndpoints,
			...(baseURL === ''
				? endpoints
				: this.normalizeEndpoints(baseURL, endpoints)),
		};
	}

	private readonly setListeners = (): void => {
		this.server.on('error', (error) => {
			this.emit('error', error);
		});

		this.on('error', (error) => {
			console.error(error);
		});
	};

	private readonly setEndpointEvent = (
		baseURL: string,
		endpoint: Endpoint,
		path: string,
		method: HttpMethod
	): void => {
		const normalizedPath = baseURL + path;

		if (this.isEndpointAlreadyExists(normalizedPath, method)) {
			throw new Error(`Endpoint ${path} already exists for method ${method}`);
		}

		const handler = endpoint[method];

		if (!handler) {
			throw new Error(
				`Endpoint ${path} doesn't have handler for method ${method}`
			);
		}

		this.on(
			this.constructEventName(normalizedPath, method),
			(req: ExtendedRequest, res: http.ServerResponse) => {
				handler(req, res).catch((error) => {
					this.emit('error', error);

					res.writeHead(500, ERRORS.INTERNAL_SERVER_ERROR);
					res.end(ERRORS.INTERNAL_SERVER_ERROR);
				});
			}
		);
	};

	private setRequestListeners(
		req: ExtendedRequest,
		res: http.ServerResponse
	): void {
		res.on('error', (error: unknown) => this.emit('error', error));
	}

	private isEndpointAlreadyExists(path: string, method: HttpMethod): boolean {
		return !!this.allEndpoints[path]?.[method];
	}

	private constructEventName(path: string, method: string): string {
		return `${path}:${method}`;
	}

	private normalizeEndpoints(baseURL: string, endpoints: Endpoints): Endpoints {
		const normalizedEndpoints: Endpoints = {};

		keys(endpoints).forEach((path) => {
			const endpoint = endpoints[path];

			normalizedEndpoints[baseURL + path] = { ...endpoint };
		});

		return normalizedEndpoints;
	}

	private readonly handleRequest = async (
		req: ExtendedRequest,
		res: http.ServerResponse
	): Promise<void> => {
		const requestPath = req.url ?? '/';
		const requestMethod = req.method as HttpMethod;

		let isHandled = false;

		for (const endpointPath of Object.keys(this.allEndpoints)) {
			const pattern = this.getPatternRegex(endpointPath);

			if (pattern.test(requestPath)) {
				req.params = this.extractParams(endpointPath, requestPath);

				for await (const middleware of this.middlewares) {
					try {
						await middleware(req, res);
					} catch (error: unknown) {
						this.emit('error', error);
					}
				}

				isHandled = this.emit(
					this.constructEventName(endpointPath, requestMethod),
					req,
					res
				);
				break;
			}
		}

		if (!isHandled) this.sendNotFound(res);
	};

	private sendNotFound(res: http.ServerResponse): void {
		res.statusCode = 404;
		res.end(ERRORS.NOT_FOUND);
	}

	private getPatternRegex(path: string): RegExp {
		const pattern = path.replace(/:[^/]+/g, '([^/]+)');
		return new RegExp(`^${pattern}$`);
	}

	private extractParams(
		endpointPath: string,
		requestPath: string
	): Record<string, string> {
		const endpointSegments = endpointPath.split('/');
		const requestSegments = requestPath.split('/');

		return endpointSegments.reduce(
			(params: Record<string, string>, endpointSegment, i) => {
				if (endpointSegment.startsWith(':')) {
					const paramName = endpointSegment.substring(1);
					const paramValue = requestSegments[i];

					params[paramName] = paramValue;
				}

				return params;
			},
			{}
		);
	}
}
