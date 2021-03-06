import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import { getPath } from '@helpers/functions';
import { getI18N } from '@helpers/bootstrapper';
import * as Discord from 'discord.js';
import { BotPlugin } from '@decorators/BotPlugin';

@BotPlugin('wowlogs')
export class WoWLogsPlugin extends Plugin {
	constructor() {
		super('World Of Warcraft Logs', {
			configOptions: {
				name: 'wowlogs.json', 
				structure: WoWLogsPlugin.getConfigStructure(),
			}
		});

		const i18n = getI18N();

		const getLogsCmd = new Command('logs', 'Warcraft Logs', i18n.translate('plugin.warcraftLogs.desc'), this.getLogs);
		super.addCommand(getLogsCmd);	
	}

	private getLogs = (fParams: Record<string, any>, args: string[]): Promise<Discord.MessageEmbed> => {
		// Warcraft Logs api
		const api = require('weasel.js');

		const i18n = getI18N();
		const S = WoWLogsPlugin.getConfigStructure();
		const config = this.configuration as typeof S;
		// Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser
		api.setApiKey(config.wLogsAPIKey);

		// Optional parameters for the api call.
		const params = {};
		return new Promise ((resolve, reject) => {
			// Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params.
			api.getReportsGuild(config.guildInfo.guildName, config.guildInfo.guildRealm, config.guildInfo.guildRegion, params, function(err: Error, data: any[]) {
				if (err) {
					// We caught an error, send it to the callback function.
					reject(err);
				}
				// Success
				const lastN = 5;
				const logsObj = data.slice(-lastN);
				let logInfo: any[] = [];
				logsObj.forEach(function(e) {
					const d = new Date(e.start);
					const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
					const date = d.toLocaleString('en-GB', options);
					const info = [{
						name: `${e.title} - https://www.warcraftlogs.com/reports/${e.id}`,
						value: i18n.translate('plugin.warcraftLogs.logDate', date, e.owner),
					}];
					logInfo = logInfo.concat(info);
				});

				const embedMsg = new Discord.MessageEmbed()
					.setAuthor(i18n.translate('WarCraft Logs', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
					.setColor(3447003)
					.setTitle(`${i18n.translate('plugin.warcraftLogs.atWarcraftLogs', config.guildInfo.guildName)}`)
					.setURL('https://www.warcraftlogs.com/guilds/154273') // FIXME: 404
					.addFields(logInfo);
				resolve(embedMsg);
			});
		});
	}

	private static getConfigStructure() {
		let cfg: WoWLogsPluginOptions;
		return cfg;
	}
}