import type http from 'http';

export const json = (
	req: http.IncomingMessage,
	res: http.ServerResponse
): void => {
	res.writeHead(200, {
		'Content-type': 'application/json',
	});

	const originalEnd = res.end;

	// @ts-expect-error I don't know how to correctly type this
	res.end = function (data: unknown, encoding, callback) {
		if (!!data && typeof data !== 'string') {
			data = JSON.stringify(data);
		}

		originalEnd.call(this, data, encoding, callback);
	};
};
