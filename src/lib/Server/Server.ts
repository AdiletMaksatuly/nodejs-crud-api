
import http from 'http';
import Router from "../Router/Router.js";
import EventEmitter from 'events';
import {keys} from "../../utils/keys.util.js";
import {Endpoints, HttpMethod} from "../Router/endpoints.interface.js";
import {Middleware} from "../models/middleware.type.js";

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

    private handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
        const path = req.url!;
        const method = req.method as HttpMethod;

        if (!this.allEndpoints[path]?.[method]) {
            this.sendNotFound(res);
            return;
        }

        this.middlewares.forEach((middleware) => middleware(req, res));

        const emitted = this.emit(this.constructEventName(path, method), req, res);

        if (!emitted) {
            this.sendNotFound(res);
        }
    }

    private sendNotFound(res: http.ServerResponse): void {
        res.statusCode = 404;
        res.end('Not found');
    }
}