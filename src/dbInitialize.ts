// CREATE THE DB TABLES

import {createConnection, ConnectionOptions} from "typeorm";
import { Config } from "@helpers/config";
import { getPath } from "@helpers/functions";

const configObj = new Config();
const config = configObj.getConfig();
const url = config.development.database.uri || process.env.DATABASE_CONNECTION_URI;

const rootPath = getPath();
const options: ConnectionOptions = {
	type: 'sqlite',
	database: url,
	entities: [ `${rootPath}/persistence/models/*.js` ],
	synchronize: true,
};

createConnection(options)
.then(() => console.log('Database initialized correctly!'))
.catch((e) => console.error('An error ocurred initializing database', e));