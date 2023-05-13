import http from "http";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Endpoint = {
    [key in HttpMethod]: http.RequestListener;
}

export interface Endpoints {
    [path: string]: Endpoint;
}