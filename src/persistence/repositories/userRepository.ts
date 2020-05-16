import { UserEntity } from '@persistence/entities/User';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
	getBTag (userID: string): Promise<string> {
		// Get user data from persistance
		return new Promise ((resolve, reject) => {
			this.findOne({
				select : ['btag'],
				where: {
					user_id: userID,
				},
			})
			.then ((data: UserEntity) => {
				let btag = null;
				if (data) {
					btag = data.btag;
				}
				resolve(btag);
			});
		});
	}

	setBTag (newBTag: string | null, userID: string): Promise<UserEntity> {
		// Insert/update new info
		const user = new UserEntity();
		user.user_id = userID;
		user.btag = newBTag;
		return this.save(user);
	}
}
