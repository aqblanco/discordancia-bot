import { Plugin } from '@classes/Plugin.class';
import { Command } from '@classes/Command.class';
import { EventHandler } from '@classes/EventHandler.class';
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

	interface PluginOptions {
		commands?: Command[],
		eventHandlers?: EventHandler<any>[],
		configOptions?: PluginConfigOptions,
		canBeDisabled?: boolean,
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
		plugins?: string[],
	}

	type Locale = "aa"|"ab"|"ae"|"af"|"ak"|"am"|"an"|"ar"|"as"|"av"|"ay"|"az"|"ba"|"be"|
		"bg"|"bh"|"bi"|"bm"|"bn"|"bo"|"br"|"bs"|"ca"|"ce"|"ch"|"co"|"cr"|"cs"|"cu"|"cv"|
		"cy"|"da"|"de"|"dv"|"dz"|"ee"|"el"|"en"|"eo"|"es"|"et"|"eu"|"fa"|"ff"|"fi"|"fj"|
		"fo"|"fr"|"fy"|"ga"|"gd"|"gl"|"gn"|"gu"|"gv"|"ha"|"he"|"hi"|"ho"|"hr"|"ht"|"hu"|
		"hy"|"hz"|"ia"|"id"|"ie"|"ig"|"ii"|"ik"|"io"|"is"|"it"|"iu"|"ja"|"jv"|"ka"|"kg"|
		"ki"|"kj"|"kk"|"kl"|"km"|"kn"|"ko"|"kr"|"ks"|"ku"|"kv"|"kw"|"ky"|"la"|"lb"|"lg"|
		"li"|"ln"|"lo"|"lt"|"lu"|"lv"|"mg"|"mh"|"mi"|"mk"|"ml"|"mn"|"mr"|"ms"|"mt"|"my"|
		"na"|"nb"|"nd"|"ne"|"ng"|"nl"|"nn"|"no"|"nr"|"nv"|"ny"|"oc"|"oj"|"om"|"or"|"os"|
		"pa"|"pi"|"pl"|"ps"|"pt"|"qu"|"rm"|"rn"|"ro"|"ru"|"rw"|"sa"|"sc"|"sd"|"se"|"sg"|
		"si"|"sk"|"sl"|"sm"|"sn"|"so"|"sq"|"sr"|"ss"|"st"|"su"|"sv"|"sw"|"ta"|"te"|"tg"|
		"th"|"ti"|"tk"|"tl"|"tn"|"to"|"tr"|"ts"|"tt"|"tw"|"ty"|"ug"|"uk"|"ur"|"uz"|"ve"|
		"vi"|"vo"|"wa"|"wo"|"xh"|"yi"|"yo"|"za"|"zh"|"zu";

	interface I18nConfig {
		supportedLocales: string[];
		currentLocale: string;
	}

	interface StringToStringMap {
		[key: string]: string;
	}

	type Translations = StringToStringMap;
}