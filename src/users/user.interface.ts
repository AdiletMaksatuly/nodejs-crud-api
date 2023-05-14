import { type v4 } from 'uuid';

export interface User {
	id?: ReturnType<typeof v4>;
	username: string;
	age: number;
	hobbies: string[];
}
