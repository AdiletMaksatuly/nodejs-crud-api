export interface BaseOperationMessage {
	operation: 'get' | 'set';
}
export interface GetOperationMessage extends BaseOperationMessage {
	operation: 'get';
	key: string;
}

export interface SetOperationMessage extends BaseOperationMessage {
	operation: 'set';
	key: string;
	value: unknown;
}

export type OperationMessage = GetOperationMessage | SetOperationMessage;

export interface MessageFromMaster<MessageType> {
	message: MessageType;
}

export type MessageFromMasterSuccess = MessageFromMaster<'OK'>;
