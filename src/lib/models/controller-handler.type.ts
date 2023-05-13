import http from "http";
import {CustomRequest} from "./request.type.js";

export type ControllerHandler = (req: CustomRequest, res: http.ServerResponse) => void;
