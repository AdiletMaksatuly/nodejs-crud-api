interface User {
	id?: string;
	username: string;
	age: number;
	hobbies: string[];
}

class UsersService {
	private readonly users: User[] = [];

	public async find(): Promise<User[]> {
		return this.users;
	}
}

export default new UsersService();
