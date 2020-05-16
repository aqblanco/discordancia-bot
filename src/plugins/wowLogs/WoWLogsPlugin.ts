import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import { i18n } from '@helpers/functions';
import { Config } from '@helpers/config'; 
import * as Discord from 'discord.js';

export class WoWLogsPlugin extends Plugin {
	constructor() {
		super('World Of Warcraft Logs', [], []);

		const getLogsCmd = new Command('logs', 'Warcraft Logs', i18n.__('plugin.warcraftLogs.desc'), this.getLogs);
		super.addCommand(getLogsCmd);	
	}

	private getLogs(fParams: Record<string, any>, args: string[]): Promise<Discord.MessageEmbed> {
		// Warcraft Logs api
		const api = require('weasel.js');

		const configObj = new Config();
		const config = configObj.getConfig();

		// Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser
		api.setApiKey(config.development.apiKeys.wLogsAPIKey);

		// Optional parameters for the api call.
		const params = {};
		return new Promise ((resolve, reject) => {
			// Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params.
			api.getReportsGuild(config.development.guildInfo.guildName, config.development.guildInfo.guildRealm, config.development.guildInfo.guildRegion, params, function(err: Error, data: any[]) {
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
						value: i18n.__('plugin.warcraftLogs.logDate', date, e.owner),
					}];
					logInfo = logInfo.concat(info);
				});

				const embedMsg = new Discord.MessageEmbed()
					.setAuthor(i18n.__('WarCraft Logs', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
					.setColor(3447003)
					.setTitle(`${i18n.__('plugin.warcraftLogs.atWarcraftLogs', config.development.guildInfo.guildName)}`)
					.setURL('https://www.warcraftlogs.com/guilds/154273') // FIXME: 404
					.addFields(logInfo);
				resolve(embedMsg);
			});
		});
	}
}