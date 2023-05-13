import {Endpoints, HttpMethod} from "./endpoints.interface.js";
import http from "http";

export default class Router {
    private readonly endpoints: Endpoints;

    constructor() {
        this.endpoints = {};
    };

    public getEndpoints() {
        return this.endpoints;
    }

    private addEndpoint(method: HttpMethod, path: string, handler: http.RequestListener) {
        if (!this.endpoints[path]) {
            this.endpoints[path] = {} as Endpoints[typeof path];
        }

        const endpoint = this.endpoints[path];

        if (endpoint[method]) {
            throw new Error(`Endpoint ${path} already exists for method ${method}`);
        }

        endpoint[method] = handler;
    }

    public get(path: string, handler: http.RequestListener) {
        this.addEndpoint('GET', path, handler)
    }

    public post(path: string, handler: http.RequestListener) {
        this.addEndpoint('POST', path, handler)
    }

    public put(path: string, handler: http.RequestListener) {
        this.addEndpoint('PUT', path, handler)
    }

    public delete(path: string, handler: http.RequestListener) {
        this.addEndpoint('DELETE', path, handler)
    }
}