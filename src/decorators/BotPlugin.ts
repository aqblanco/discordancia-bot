import "reflect-metadata";

export const BotPluginMetdataKey = Symbol("BotPluginKey");

export function BotPlugin(value: string) {
	return Reflect.metadata(BotPluginMetdataKey, value);
}