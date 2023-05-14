import { v4 } from 'uuid';
import { ERRORS } from '../lib/index.js';
import { type User } from './user.interface.js';

class UsersService {
	private readonly users: User[] = [
		{
			id: v4(),
			username: 'John',
			age: 25,
			hobbies: ['reading', 'coding'],
		},
	];

	public async find(): Promise<User[]> {
		return this.users;
	}

	public async findById(id: string): Promise<User> {
		const foundUser = this.users.find((user) => user.id === id);

		if (!foundUser) throw new Error(ERRORS.NOT_FOUND);

		return foundUser;
	}
}

export default new UsersService();
