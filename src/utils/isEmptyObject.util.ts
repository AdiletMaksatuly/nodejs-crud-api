import { type EmptyObject } from '../types/empty-object.type.js';

export const isEmptyObject = (obj: unknown): obj is EmptyObject => {
	return !!obj && typeof obj === 'object' && Object.keys(obj).length === 0;
};
