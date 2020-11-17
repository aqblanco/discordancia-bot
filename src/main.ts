import "reflect-metadata";
import * as Bootstrapper from '@helpers/bootstrapper';
import { DiscordBot as DiscordBot } from '@classes/DiscordBot.class';
import { EventHandler } from '@classes/EventHandler.class';

async function main() {
	// Initiliaze app
	Bootstrapper.bootstrap();

	const configObj = Bootstrapper.getConfigManager();
	const config = configObj.configuration;
	const token = config.apiKeys.discordAPIKey;
	const cmdPrefix = config.botConfig.prefix;
	const userName = config.botConfig.botUserName;
	const plugins = config.botConfig.enabledPlugins;
	const activity = 'Ayuda: ' + cmdPrefix + ' ayuda';
	const i18n = Bootstrapper.getI18N();
	
	const botConfig = {
		prefix: cmdPrefix,
		discordAPIKey: token,
		botUserName: userName,
		botActivity: activity,
		plugins: plugins,
	}

	const botObj = await DiscordBot.initializeBot(botConfig);

	// The ready event is vital, it means that your bot will only start reacting to information
	// from Discord after_ ready is emitted
	const readyEvent = new EventHandler<'ready'>('ready', () => {
		/*client.user.setUsername(config.development.botConfig.username);
		client.user.setActivity('Ayuda: ' + cmdPrefix + ' ayuda');*/
		
		console.log(i18n.translate('botStarted'));
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