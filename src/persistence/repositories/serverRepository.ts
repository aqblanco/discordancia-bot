import { ServerEntity } from '@persistence/entities/Server';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(ServerEntity)
export class ServerRepository extends Repository<ServerEntity> {

	getMotD (server: string): Promise<ServerEntity> {
		return this.findOne({
			select : ['motd', 'updatedAt'],
			where: {
				server_id: server,
			},
		});
	}

	setMotD (serverID: string, motd: string): Promise<ServerEntity> {
		const server = new ServerEntity();
		server.server_id = serverID;
		server.motd = motd;
		return this.save(server);
	}
}