import { Config } from '@helpers/config';
import { TypeORMDB } from '@persistence/classes/TypeORM.class';
import { ConnectionOptions } from 'typeorm';
import { getPath } from '@helpers/functions';

export async function getDB() {
	const configObj = new Config();
	const config = configObj.getConfig();
	const url = config.development.database.uri || process.env.DATABASE_CONNECTION_URI;

	const rootPath = getPath();
	const options: ConnectionOptions = {
		type: 'sqlite',
		database: url,
		entities: [ `${rootPath}/persistence/entities/*.js` ],
	};
	
	let DBInstance = TypeORMDB.getDBManager(options);
	return DBInstance;
}