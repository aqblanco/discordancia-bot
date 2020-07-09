import { Connection, ConnectionOptions, ObjectType, ConnectionManager,EntityManager } from "typeorm";
import { singleton, inject } from "tsyringe";

// TODO: Create interface to be implemented by this
@singleton()
export class TypeORMDB {
	private connection: Connection;
	private entityManager: EntityManager;


	constructor(@inject("DBOptions") options: ConnectionOptions) {
		const connectionManager = new ConnectionManager();
		this.connection = connectionManager.create(options);
	}

	async getRepository<Repository>(repository: ObjectType<Repository>): Promise<Repository> {
		const isConnected = this.connection.isConnected;

		if (!isConnected) {
			// Connect first
			await this.connection.connect();
		}
		if (!this.entityManager) {
			this.entityManager = await this.connection.createEntityManager();
		}
		return this.entityManager.getCustomRepository(repository);
	}
}