import { UserServerEntity } from '@persistence/entities/UserServer';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(UserServerEntity)
export class UserServerRepository extends Repository<UserServerEntity> {
	getLastConnection (user: string, server: string): Promise<Date> {
		return new Promise ((resolve, reject) => {
			this.findOne({
				select : ['last_connection'],
				where: {
					user_id: user,
					server_id: server,
				},
			})
			.then((data: UserServerEntity) => {
				let lastCon = null;
				if (data) {
					lastCon = data.last_connection;
				}
				resolve(lastCon);
			})
			.catch((e: Error) => {
				reject(e);
			});
		});
	}

	setLastConnection (user: string, server: string, time: Date): Promise<UserServerEntity> {
		const userServer = new UserServerEntity();
		userServer.user_id = user;
		userServer.server_id = server;
		userServer.last_connection = time;
		return this.save(userServer);
	}
}