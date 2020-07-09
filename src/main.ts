import "reflect-metadata";
import { i18n, pluginIsEnabled } from '@helpers/functions';
import * as Bootstrapper from '@helpers/bootstrapper';
import { DiscordBot as DiscordBot } from '@classes/DiscordBot.class';
import { EventHandler } from '@classes/EventHandler.class';
import { PlayAudioPlugin } from '@plugins/playAudio/PlayAudioPlugin';
import { WoWLogsPlugin } from '@plugins/wowLogs/WoWLogsPlugin';
import { ServerMotDPlugin } from '@plugins/serverMotD/ServerMotDPlugin';
import { OWStatsPlugin } from '@plugins/owStats/OWStatsPlugin';
import { ManageUserBTagPlugin } from '@plugins/manageUserBTag/ManageUserBTagPlugin';

async function main() {
	// Initiliaze app
	Bootstrapper.bootstrap();

	const configObj = Bootstrapper.getConfigManager();
	const config = configObj.configuration;
	const token = config.apiKeys.discordAPIKey;
	const cmdPrefix = config.botConfig.prefix;
	const userName = config.botConfig.botUserName;
	const activity = 'Ayuda: ' + cmdPrefix + ' ayuda';
	
	const botConfig = {
		prefix: cmdPrefix,
		discordAPIKey: token,
		botUserName: userName,
		botActivity: activity,
		plugins: [PlayAudioPlugin, WoWLogsPlugin, OWStatsPlugin, ManageUserBTagPlugin, ServerMotDPlugin],
	}

	const botObj = DiscordBot.initializeBot(botConfig);

	// The ready event is vital, it means that your bot will only start reacting to information
	// from Discord after_ ready is emitted
	const readyEvent = new EventHandler<'ready'>('ready', () => {
		/*client.user.setUsername(config.development.botConfig.username);
		client.user.setActivity('Ayuda: ' + cmdPrefix + ' ayuda');*/
		
		console.log(i18n.__('botStarted'));
	});
	botObj.addEventHandler(readyEvent);

	// TODO: Probably move this into bot class
	// Create an event listener for messages
	const messageEvent = new EventHandler<'message'>('message', message => {
		if (message.author.bot) {
			// Do nothing
			return;
		}
		const botUser = config.botConfig.botUserName;//client.user.username;
		const firstEle = message.content.split(/\s+/g)[0];

		const prefixPresent = firstEle.toLowerCase() === cmdPrefix.toLowerCase();
		const mentionPresent = message.mentions.users.find(user => user.username === botUser) !== null;
		const isDM = message.channel.type == 'dm';

		// Reply when using bot prefix or mentions, ignore direct messages, as it's impossible to determine the server
		if ((prefixPresent || mentionPresent) && !isDM) {
			// Cut the prefix or bot mention from the message
			const tempA = message.content.split(/\s+/g);
			// Prefix item
			tempA.splice(0, 1);
			// Redo string
			message.content = tempA.join(' ');
			botObj.reply(message);
		}
	});
	botObj.addEventHandler(messageEvent);

	botObj.connect()
	.then(() => {});
}

main();