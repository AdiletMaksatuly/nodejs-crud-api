import { type SetOperationMessage } from '../Database/message.interface.js';

export const isSetOperationMessage = (
	message: unknown
): message is SetOperationMessage => {
	return (
		!!message &&
		typeof message === 'object' &&
		'operation' in message &&
		message.operation === 'set' &&
		'key' in message &&
		typeof message.key === 'string' &&
		'value' in message
	);
};
