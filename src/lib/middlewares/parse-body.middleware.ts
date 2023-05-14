import type http from 'http';
import type ExtendedRequest from '../ExtendedRequest/ExtendedRequest.js';

export const parseBody = async (
	req: ExtendedRequest,
	res: http.ServerResponse
): Promise<void> => {
	await new Promise((resolve, reject) => {
		let body: string = '';
		const chunks: Buffer[] = [];

		req
			.on('data', (chunk: Buffer) => {
				chunks.push(chunk);
			})
			.on('end', () => {
				body = Buffer.concat(chunks).toString();

				req.body = body;
				resolve();
			})
			.on('error', (error: Error) => {
				reject(error);
			});
	});
};
