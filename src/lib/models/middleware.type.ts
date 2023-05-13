import type http from 'http';

export type Middleware = (
	req: http.IncomingMessage,
	res: http.ServerResponse
) => void;
