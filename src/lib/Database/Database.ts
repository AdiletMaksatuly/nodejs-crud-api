export default class Database {
	private readonly database = new Map<string, unknown>();

	public get<T>(key: string): T {
		return this.database.get(key) as T;
	}

	public set(key: string, value: unknown): void {
		this.database.set(key, value);
	}
}
