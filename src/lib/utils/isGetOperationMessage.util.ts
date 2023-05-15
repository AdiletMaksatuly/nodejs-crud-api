import { type GetOperationMessage } from '../Database/message.interface.js';

export const isGetOperationMessage = (
	message: unknown
): message is GetOperationMessage => {
	return (
		!!message &&
		typeof message === 'object' &&
		'operation' in message &&
		message.operation === 'get' &&
		'key' in message &&
		typeof message.key === 'string'
	);
};
