import http from 'http';
import Router from "../Router/Router.js";
import EventEmitter from 'events';
import {keys} from "../../utils/keys.util.js";
import {Endpoints, HttpMethod} from "../Router/endpoints.interface.js";
import {Middleware} from "../models/middleware.type.js";
import {CustomRequest} from "../models/request.type.js";

export default class Server extends EventEmitter {
    private server: http.Server;

    private allEndpoints: Endpoints = {};

    private middlewares: Middleware[] = [];

    constructor() {
        super();
        this.server = http.createServer(this.handleRequest);
    }

    public listen(port: number | string, callback: () => void) {
        this.server.listen(+port, callback);
    }

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    public registerRouter(baseURL: string, router: Router) {
        const endpoints = router.getEndpoints();

        const setEndpointEvent = (path: string) => {
            const endpoint = endpoints[path];

            keys(endpoint).forEach((method) => {
                const normalizedPath = baseURL + path;

                if (this.isEndpointAlreadyExists(normalizedPath, method)) {
                    throw new Error(`Endpoint ${path} already exists for method ${method}`);
                }

                const handler = endpoint[method];

                this.on(this.constructEventName(normalizedPath, method), handler);
            });
        };

        keys(endpoints).forEach((path) => setEndpointEvent(String(path)));

        this.allEndpoints = {
            ...this.allEndpoints,
            ...(baseURL ? this.normalizeEndpoints(baseURL, endpoints) : endpoints)
        };
    }

    private isEndpointAlreadyExists(path: string, method: HttpMethod) {
        return this.allEndpoints[path]?.[method];
    }

    private constructEventName(path: string, method: string) {
        return `${path}:${method}`;
    }

    private normalizeEndpoints(baseURL: string, endpoints: Endpoints) {
        const normalizedEndpoints: Endpoints = {};

        keys(endpoints).forEach((path) => {
            const endpoint = endpoints[path];

            normalizedEndpoints[baseURL + path] = { ...endpoint };
        });

        return normalizedEndpoints;
    }

    private handleRequest = (req: CustomRequest, res: http.ServerResponse) => {
        const requestPath = req.url!;
        const requestMethod = req.method as HttpMethod;

        let isHandled = false;

        for (const endpointPath of Object.keys(this.allEndpoints)) {
            const pattern = this.getPatternRegex(endpointPath);

            if (pattern.test(requestPath)) {
                req.params = this.extractParams(endpointPath, requestPath);

                this.middlewares.forEach((middleware) => middleware(req, res));

                isHandled = this.emit(this.constructEventName(endpointPath, requestMethod), req, res);
                break;
            }
        }

        if (!isHandled) this.sendNotFound(res);
    }

    private sendNotFound(res: http.ServerResponse): void {
        res.statusCode = 404;
        res.end('Not found');
    }

    private getPatternRegex(path: string): RegExp {
        const pattern = path.replace(/:[^/]+/g, '([^/]+)');
        return new RegExp(`^${pattern}$`);
    }

    private extractParams(endpointPath: string, requestPath: string): Record<string, string> {
        const endpointSegments = endpointPath.split('/');
        const requestSegments = requestPath.split('/');

        return endpointSegments.reduce((params: Record<string, string>, endpointSegment, i) => {
            if (endpointSegment.startsWith(':')) {
                const paramName = endpointSegment.substring(1);
                const paramValue = requestSegments[i];

                params[paramName] = paramValue;
            }

            return params;
        }, {});
    }
}