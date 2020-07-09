import { Plugin } from '@classes/Plugin.class';
import { PathLike } from 'fs';

declare global {
	interface CommandArgument {
		tag: string,
		desc: string,
		optional: boolean,
	}

	const enum CommandLevel {
		Everyone = 0,
		BotManager,
		Admin,
	}

	const enum PluginStatus {
		Disabled = 0,
		Enabled,
	}

	const enum CommandStatus {
		Disabled = 0,
		Enabled,
	}

	type Resource = ResourceAudio | ResourceImage;

	type ResourceCategory = "audio" | "image";

	interface ResourceGeneral {
		name: string,
		file: string,
	}

	interface ResourceAudio extends ResourceGeneral {}
	interface ResourceImage extends ResourceGeneral {}
	
	type ConfigCategoryLabel = "apiKeys"|"botConfig"|"database"/*|"pluginOptions"*/;


	interface ConfigOptionsStructure {}

	interface ConfigFileOptionsBase extends ConfigOptionsStructure {
		apiKeys: APIKeysConfigOptions,
		botConfig: BotConfigOptions,
		database: DatabaseConfigOptions,
	}

	interface APIKeysConfigOptions {
		discordAPIKey: string,
		wLogsAPIKey: string,
	}

	interface BotConfigOptions {
		prefix: string,
		botUserName: string,
		botActivity: string,
		enabledPlugins: string[],
	}

	interface DatabaseConfigOptions {
		uri: string
	}

	// Data structure to keep the options needed to setup a plugin configuration's
	interface PluginConfigOptions {
		name: PathLike,
		structure: ConfigOptionsStructure,
	}

	interface BotConfig {
		prefix: string,
		discordAPIKey: string,
		botUserName: string,
		botActivity: string,
		plugins: typeof Plugin[],
	}

}