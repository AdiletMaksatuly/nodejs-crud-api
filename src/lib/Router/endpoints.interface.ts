import http from "http";
import {CustomRequest} from "../models/request.type.js";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Endpoint = {
    [key in HttpMethod]: (req: CustomRequest, res: http.ServerResponse) => void;
}

export interface Endpoints {
    [path: string]: Endpoint;
}