import { Connection, ConnectionOptions, ObjectType, ConnectionManager,EntityManager } from "typeorm";

// TODO: Create interface to be implemented by this
export class TypeORMDB {
	private static connection: Connection;
	private static entityManager: EntityManager;
	private static dbObject: TypeORMDB;

	private constructor(options: ConnectionOptions) {
		const connectionManager = new ConnectionManager();
		TypeORMDB.connection = connectionManager.create(options);
	}

	static async getDBManager(options?: ConnectionOptions): Promise<TypeORMDB> {
		if (!TypeORMDB.dbObject) {
			TypeORMDB.dbObject = new TypeORMDB(options);
			TypeORMDB.entityManager = await TypeORMDB.connection.createEntityManager();
		}
		return(TypeORMDB.dbObject);
	}

	// Use in a possible interface, no usage for TYPEORM (no way to add entity schemas dynamically?)
	/*async addEntity<Entity>(entity: ObjectType<Entity>) {
		const isConnected = TypeORMDB.connection.isConnected;
		if (!isConnected) {
			// Connect first
			await TypeORMDB.connection.connect();
		}
	}*/

	async getRepository<Repository>(repository: ObjectType<Repository>): Promise<Repository> {
		const isConnected = TypeORMDB.connection.isConnected;

		if (!isConnected) {
			// Connect first
			await TypeORMDB.connection.connect();
		}
		return TypeORMDB.entityManager.getCustomRepository(repository);
	}
}