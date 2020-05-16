import { Plugin } from '@classes/Plugin.class';

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

	interface BotConfig {
		prefix: string,
		discordAPIKey: string,
		botUserName: string,
		botActivity: string,
		plugins: typeof Plugin[],
	}

}