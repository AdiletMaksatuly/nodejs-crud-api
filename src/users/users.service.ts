import { v4 } from 'uuid';
import { ERRORS } from '../lib/index.js';
import { type User, type UserWithoutId } from './user.interface.js';

class UsersService {
	private users: User[] = [
		{
			id: 'edd2ea12-5043-4a5a-81bc-85b2d4ac823a',
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

	public async createUser(userToCreate: unknown): Promise<User> {
		if (!this.isValidUser(userToCreate)) throw new Error(ERRORS.BAD_REQUEST);

		const user: User = {
			...userToCreate,
			id: v4(),
		};

		this.users = [...this.users, user];

		return user;
	}

	public async findByIdAndUpdate(
		id: string,
		userToUpdate: unknown
	): Promise<User> {
		if (!this.isValidUser(userToUpdate)) throw new Error(ERRORS.BAD_REQUEST);

		const newUser = {
			...userToUpdate,
			id,
		};

		const doesUserExist = this.users.findIndex((user) => user.id === id) !== -1;

		if (!doesUserExist) throw new Error(ERRORS.NOT_FOUND);

		this.users = this.users.map((user) => {
			if (user.id === id) return newUser;

			return user;
		});

		return newUser;
	}

	public async findByIdAndDelete(id: string): Promise<void> {
		const doesUserExist = this.users.findIndex((user) => user.id === id) !== -1;

		if (!doesUserExist) throw new Error(ERRORS.NOT_FOUND);

		this.users = this.users.filter((user) => user.id !== id);
	}

	private isValidUser(obj: unknown): obj is UserWithoutId {
		// TODO make this unwrapped to explicitly inform what condition is wrong
		return (
			!!obj &&
			typeof obj === 'object' &&
			'username' in obj &&
			typeof obj.username === 'string' &&
			'age' in obj &&
			typeof obj.age === 'number' &&
			'hobbies' in obj &&
			Array.isArray(obj.hobbies) &&
			obj.hobbies.every((hobby) => typeof hobby === 'string')
		);
	}
}

export default new UsersService();
