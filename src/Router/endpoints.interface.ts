import http from "http";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Endpoints {
    [path: string]: {
        [method in HttpMethod]: http.RequestListener;
    };
}