import { v4 } from 'uuid';
import { ERRORS } from '../lib/index.js';
import { type User, type UserWithoutId } from './user.interface.js';
import cluster from 'cluster';
import {
	type MessageFromMaster,
	type OperationMessage,
	type MessageFromMasterSuccess,
} from '../lib/Database/message.interface.js';
import { type EmptyObject } from '../types/empty-object.type.js';
import { isEmptyObject } from '../utils/isEmptyObject.util.js';
import { isClusterMode } from '../utils/isClusterMode.util.js';
import { DB } from '../server.js';

class UsersService {
	// private users: User[] = [];

	public async find(): Promise<User[]> {
		if (!isClusterMode()) {
			return this.getUsersFromDB();
		}

		try {
			return await this.processDataWithMaster<User[]>({
				operation: 'get',
				key: 'users',
			});
		} catch (error: unknown) {
			if (error instanceof Error && error.message === ERRORS.NOT_FOUND) {
				return [];
			}

			throw error;
		}
	}

	public async findById(id: string): Promise<User> {
		const users = await this.getUsers();

		const foundUser = users.find((user) => user.id === id);

		if (!foundUser) throw new Error(ERRORS.NOT_FOUND);

		return foundUser;
	}

	public async createUser(userToCreate: unknown): Promise<User> {
		if (!this.isValidUser(userToCreate)) throw new Error(ERRORS.BAD_REQUEST);

		const newUser: User = {
			...userToCreate,
			id: v4(),
		};

		const oldUsers = await this.getUsers();

		const newUsers = [...oldUsers, newUser];

		await this.setUsers(newUsers);

		return newUser;
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

		const users = await this.getUsers();

		const doesUserExist = users.findIndex((user) => user.id === id) !== -1;

		if (!doesUserExist) throw new Error(ERRORS.NOT_FOUND);

		const newUsers = users.map((user) => {
			if (user.id === id) return newUser;

			return user;
		});

		await this.setUsers(newUsers);

		return newUser;
	}

	public async findByIdAndDelete(id: string): Promise<void> {
		const users = await this.getUsers();

		const doesUserExist = users.findIndex((user) => user.id === id) !== -1;

		if (!doesUserExist) throw new Error(ERRORS.NOT_FOUND);

		const newUsers = users.filter((user) => user.id !== id);

		await this.setUsers(newUsers);
	}

	// TODO rename to something different because it's being used not only to get data but also to send data
	private readonly processDataWithMaster = async <T>(
		message: OperationMessage
	): Promise<T> => {
		return await new Promise<T>((resolve, reject) => {
			if (cluster.worker === undefined)
				throw new Error('Cluster worker is undefined');

			cluster.worker.send(message);

			cluster.worker.once(
				'message',
				(data: MessageFromMaster<T> | EmptyObject) => {
					if (isEmptyObject(data)) {
						reject(new Error(ERRORS.NOT_FOUND));
						return;
					}

					resolve(data.message);
				}
			);
		});
	};

	private readonly getUsers = async (): Promise<User[]> => {
		if (isClusterMode()) {
			return await this.find();
		}

		return this.getUsersFromDB();
	};

	private readonly getUsersFromDB = (): User[] => {
		return DB.get<User[]>('users') ?? [];
	};

	private readonly setUsers = async (users: User[]): Promise<void> => {
		if (isClusterMode()) {
			await this.setUsersClusterMode(users);
			return;
		}

		DB.set('users', users);
	};

	private readonly setUsersClusterMode = async (newUsers: User[]): Promise<void> => {
		const result = await this.processDataWithMaster<MessageFromMasterSuccess>({
			operation: 'set',
			key: 'users',
			value: newUsers,
		});

		if (result.message !== 'OK') {
			throw new Error('Something went wrong when DB.set() was called');
		}
	};

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
