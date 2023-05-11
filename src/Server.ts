
import http from 'http';
import Router from "./Router/Router.js";
import EventEmitter from 'events';
import {keys} from "./utils/keys.util.js";
import {Endpoints, HttpMethod} from "./Router/endpoints.interface.js";

export default class Server extends EventEmitter {
    private server;

    constructor() {
        super();
        this.server = http.createServer(this.handleRequest);
    }

    public listen(port: number | string, callback: () => void) {
        this.server.listen(+port, callback);
    }

    public registerRouter(router: Router) {
        const endpoints = router.getEndpoints();

        const setEndpointEvent = (path: string) => {
            const endpoint = endpoints[path];

            keys(endpoint).forEach((method) => {
                const handler = endpoint[method as keyof typeof endpoint];

                this.on(this.constructEventName(path, method), handler);
            });
        };

        keys(endpoints).forEach(setEndpointEvent);
    }

    private constructEventName(path: string, method: string) {
        return `${path}:${method}`;
    }

    private handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
        const path = req.url!;
        const method = req.method as HttpMethod;

        if (!this.allEndpoints[path]?.[method]) {
            this.sendNotFound(res);
            return;
        }

        this.emit(this.constructEventName(path, method), req, res);
    }

    private sendNotFound(res: http.ServerResponse): void {
        res.statusCode = 404;
        res.end('Not found');
    }
}