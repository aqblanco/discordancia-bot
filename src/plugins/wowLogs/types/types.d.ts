interface WoWLogsPluginOptions extends ConfigOptionsStructure {
	wLogsAPIKey: string,
	guildInfo: {
		guildName: string,
		guildRealm: string,
		guildRegion: string,
	}
}