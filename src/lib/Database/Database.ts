export default class Database {
	private readonly database = new Map<string, unknown>();

	public get(key: string): unknown {
		return this.database.get(key);
	}

	public set(key: string, value: unknown): void {
		this.database.set(key, value);
	}
}
