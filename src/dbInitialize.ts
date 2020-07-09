// CREATE THE DB TABLES

import {createConnection, ConnectionOptions} from "typeorm";
import { getPath } from "@helpers/functions";

const config = require(`${getPath('config')}config.json`);
const url = config.development.database.uri || process.env.DATABASE_CONNECTION_URI;

const basePath = getPath();
const options: ConnectionOptions = {
	type: 'sqlite',
	database: url,
	entities: [ `${basePath}/persistence/models/*.js` ],
	synchronize: true,
};

createConnection(options)
.then(() => console.log('Database initialized correctly!'))
.catch((e) => console.error('An error ocurred initializing database', e));