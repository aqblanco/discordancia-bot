// CREATE THE DB TABLES

import {createConnection, ConnectionOptions} from "typeorm";
import { getPath } from "@helpers/functions";
import * as fileData from './config/config.json'

const config = fileData;
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