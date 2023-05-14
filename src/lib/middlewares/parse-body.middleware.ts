import type http from 'http';
import type ExtendedRequest from '../ExtendedRequest/ExtendedRequest.js';

export const parseBody = (
	req: ExtendedRequest,
	res: http.ServerResponse
): void => {
	let body: string = '';
	const chunks: Buffer[] = [];

	req
		.on('data', (chunk: Buffer) => {
			chunks.push(chunk);
		})
		.on('end', () => {
			body = Buffer.concat(chunks).toString();
		});

	req.body = body;
};
