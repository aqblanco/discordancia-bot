import "reflect-metadata";
import { container } from 'tsyringe';
import { ConfigManager } from '@classes/ConfigManager.class';
import { ConfigFile } from '@classes/ConfigFile.class';
import { TypeORMDB } from '@persistence/classes/TypeORM.class';
import { ConnectionOptions } from 'typeorm';
import { getPath } from '@helpers/functions';
import { ConfigType } from "@classes/ConfigType.class";

let configManager: ConfigManager<ConfigType, ConfigFileOptionsBase>;
let db: TypeORMDB;

export function bootstrap() {
	// Load configuration
	const baseConfigFile = `${getPath('config')}config.json`;
	const configFile = new ConfigFile(baseConfigFile);
	container.register("ConfigFile", { useValue: baseConfigFile });
	container.register("ConfigType", { useValue: configFile });
	container.register("Environment", { useValue: 'development' });
	configManager = container.resolve<ConfigManager<ConfigFile, ConfigFileOptionsBase>>(ConfigManager);
	configManager.readConfig();

	// Initialize database
	const config = configManager.configuration;
	const url = config.database.uri;

	const basePath = getPath();
	const options: ConnectionOptions = {
		type: 'sqlite',
		database: url,
		entities: [ `${basePath}/persistence/entities/*.js` ],
	};
	
	container.register("DBOptions", { useValue: options });
	db = container.resolve(TypeORMDB);
}

export function getConfigManager() {
	return configManager;
}

export async function getDB() {
	return db;
}