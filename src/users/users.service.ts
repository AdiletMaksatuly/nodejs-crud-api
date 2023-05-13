interface User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
}

class UsersService {
    private users: User[] = [];

    public async find() {
        return Promise.resolve(this.users);
    }
}

export default new UsersService();