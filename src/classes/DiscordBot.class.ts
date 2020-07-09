import { Plugin } from '@classes/Plugin.class';
import { Command } from '@classes/Command.class';
import { EventHandler } from '@classes/EventHandler.class';
import { HelpPlugin } from '@plugins/help/HelpPlugin';
import * as Discord from 'discord.js';
import { formatError } from '@helpers/functions';

export class DiscordBot {
	private static discordBotInstance: DiscordBot;
	private registeredPlugins: Plugin[];
	private config: BotConfig;
	private discordClient: Discord.Client;

	private constructor(config: BotConfig) {
		this.registeredPlugins = [];
		this.config = config
		this.discordClient = new Discord.Client();
	}

	static initializeBot(config: BotConfig): DiscordBot {
		const bot = DiscordBot.getBot(config);
		// Register help plugin
		const helpInstance = bot.registerPlugin(HelpPlugin);
		// Register plugins and add to help
		config.plugins.forEach((p) => {
			const pInstance = bot.registerPlugin(p);
			const cmds = pInstance.commands;
			helpInstance.addCommandsHelp(cmds);
		});
		return bot;
	}

	static getBot(config?: BotConfig): DiscordBot {
		if (!DiscordBot.discordBotInstance) {
			DiscordBot.discordBotInstance = new DiscordBot(config);
		} 

		return DiscordBot.discordBotInstance;
	}

	async connect(): Promise<void> {
		// Log in our bot
		this.discordClient.login(this.config.discordAPIKey)
		.then(() => {
			return new Promise((resolve, reject) => {
				if (this.config.botUserName) this.discordClient.user.setUsername(this.config.botUserName);
				if (this.config.botActivity) this.discordClient.user.setActivity(this.config.botActivity);
				resolve();
			}); 
		});
	}

	reply(message: Discord.Message) {

		console.log('Comando recibido: ' + message.content);
		// Process request string
		const reqArray = message.content.split(/\s+/g);
		const request = reqArray[0];
		let args: string[] | [] = [];
		if (reqArray.length > 1) {
			// Remove command
			reqArray.splice(0, 1);
			args = reqArray;
		}

		const cmd = this.matchCommand(request);
		if (cmd != null) {
			if (cmd.userCanExecute(message.member)) {
				// Send the message object to the command
				cmd.addFParams({ 'message': message });
				// TODO: Add translation
				// Show "processing" message while retrieving data
				const processingEmbed = new Discord.MessageEmbed()
					.setTitle('Processing...')
					.setColor(3447003)
					.setDescription('We are working to provide you some cool features...');
				message.channel.send(processingEmbed)
				.then(processingMsg => {
					// cmd.execute(args, function(err, msg, isEmbed = false) {
					cmd.execute(args)
					.then((msg: string | Discord.MessageEmbed) => {
						let embed;
						// Correctly generate embed object if needed
						if (typeof msg === 'string') {
							// Convert it into embed
							embed = new Discord.MessageEmbed()
								.setTitle(cmd.name)
								.setColor(3447003)
								.setDescription(msg);
						} else {
							embed = msg;
						}

						const formatedMsg = embed;
						if (Object.keys(formatedMsg).length > 0) {
							// Delete "processing" message
							processingMsg.edit({ embed: formatedMsg })
								// message.channel.send(formatedMsg)
								.then(m => console.log(JSON.stringify(m)))
								.catch(console.error);
						} else {
							// Blank message, delete processing one
							processingMsg.delete();
						}
					})
					.catch((e: Error) => {
						const embed = formatError(e.message);
						processingMsg.edit({ embed })
							.then(() => console.log(e))
							.catch(console.error);
						return;
					});
				});
			} else {
				// TODO: Add translation
				// User has no rights to use the command
				const err = new Error('No tienes los permisos necesarios para ejecutar ese comando.');
				const embed = formatError(err.message);
				message.channel.send({ embed })
					.then(() => console.log(err))
					.catch(console.error);
				return;
			}
		} else {
			// TODO: Add translation
			// Command is not valid
			const err = new Error('Comando no válido. Mencióname e introduce la palabra ayuda o escribe |rue ayuda para ver la lista de comandos disponibles.');
			const embed = formatError(err.message);
			message.channel.send({ embed })
				.then(m => console.log(err))
				.catch(console.error);
			return;
		}
	}

	registerPlugin<P extends Plugin>(plugin: { new(...args : any): P ;} ): P {
		const p = new plugin();
		// Add to plugin list
		this.registeredPlugins.push(p);
		// Register event handlers
		const eventHandlers = p.eventHandlers;
		eventHandlers.forEach((h) => {
			this.addEventHandler(h);
		});
		// Load config
		if (p.configManager) {
			p.configManager.readConfig();
		}

		return p;
	}

	addPlugin(plugin: Plugin): void {
		this.registeredPlugins.push(plugin);
	}

	addPluginList(pluginList: Plugin[]): void {
		this.registeredPlugins = this.registeredPlugins.concat(pluginList);
	}

	getPluginList(): Plugin[] {
		return this.registeredPlugins;
	}

	private getCommandList(): Command[] {
		let cmds: Command[] = [];

		if (this.registeredPlugins.length > 0) {
			this.registeredPlugins.forEach((p) => {
				cmds = cmds.concat(p.commands);
			});
		}

		return cmds;
	}

	matchCommand(cmd: string): Command | null {
		let res: Command | null = null;
		const botCommands = this.getCommandList();

		botCommands.forEach((c) => {
			if (res === null && c.label === cmd) {
				res = c;
			}
		});
		return res;
	}

	getConfig(): BotConfig {
		return this.config;
	}

	addEventHandler(eventHandler: EventHandler<any>) {
		this.discordClient.on(eventHandler.event, eventHandler.listener);
	}
};