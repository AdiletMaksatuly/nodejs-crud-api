import type http from 'http';

export interface CustomRequest extends http.IncomingMessage {
	params?: Record<string, string>;
}
