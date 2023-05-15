import type http from 'http';

export interface ExtendedRequestInterface extends http.IncomingMessage {
	params: Record<string, string>;
	body: string;
}
