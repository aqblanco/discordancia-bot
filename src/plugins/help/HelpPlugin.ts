// Imports section
import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from "@classes/Command.class";
import { i18n } from '@helpers/functions';
import * as Discord from 'discord.js';

export class HelpPlugin extends Plugin {
	commandList: Command[] = [];

	constructor() {
		super('Help', [], []);

		const helpArgs: CommandArgument[] = [{
			'tag': i18n.__('plugin.help.args.command.tag'),
			'desc': i18n.__('plugin.help.args.command.desc'),
			'optional': true,
		}];

		const helpCmd = new Command('ayuda', 'Help', i18n.__('plugin.help.desc'), this.getHelp, CommandLevel.Everyone, [], helpArgs);
		super.addCommand(helpCmd);
		this.addCommandHelp(helpCmd);
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private getHelp = (fParams: Record<string, any>, args: string[]): Promise<Discord.MessageEmbed> => {
		const command = args.length == 0 ? '' : args[0];
		const message = fParams.message;

		const userNotification = new Discord.MessageEmbed()
			.setAuthor(i18n.__('plugin.help.help', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
			.setColor(3447003)
			.setDescription(`**${i18n.__('plugin.help.helpSentNotification', `<@${message.member.user.id}>`)}**`);

		// empty check for command, else take first element
		return new Promise((resolve, reject) => {
			if (command === '') {
				this.getWholeHelp(message.member)
				.then(m => {
					/*const embed = res.embedMsg;
					message.member.send({ embed });*/
					message.member.send(m);
					
					resolve(userNotification);
				})
				.catch(e => {
					reject(e);
				});
			} else {
				this.getCommandHelp(command)
				.then(m => {
					/*const embed = res.embedMsg;
					message.member.send({ embed });*/
					message.member.send(m);

					resolve(userNotification);
				})
				.catch(e => {
					reject(e);
				});
			}
		});

	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private getWholeHelp = (requester: Discord.GuildMember): Promise<Discord.MessageEmbed> => {
		// Display the whole command list

		let msg = '';
		return new Promise((resolve, reject) => {
			this.commandList.forEach(e => {
				if (e.userCanExecute(requester)) {
					// Build argument string for the command signature
					let argString = '';
					e.argumentList.forEach(arg => {
						let tag = arg.tag;
						if (arg.optional) tag = '[' + tag + ']';
						argString += ' *`' + tag + '`* ';
					});
					msg += '**`' + e.label + '`' + argString + '** - ' + e.description + '\n';
				}
			});

			// Prepare embed output
			const embedMsg = new Discord.MessageEmbed()
				.setAuthor(i18n.__('plugin.help.help', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
				.setColor(3447003)
				.setDescription(msg);

			resolve(embedMsg);
		});
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private getCommandHelp = (command: string): Promise<Discord.MessageEmbed> => {
		// Display desired command help
		return new Promise((resolve, reject) => {
			// Search for the command in the list
			let found: Command;

			// TODO: Add a method in command class to find a command in the list
			this.commandList.forEach(function (c) {
				if (c.label == command) found = c;
			});
			if (found) {
				// Command found
				let argsStr = '';
				const args = found.argumentList;
				args.forEach(function (a: CommandArgument) {
					let opt = '';
					if (a.optional) opt = '(' + i18n.__('plugin.help.optional') + ') ';
					argsStr += '`' + a.tag + '` ' + opt + '- ' + a.desc + '\n';
				});
				if (argsStr === '') argsStr = i18n.__('plugin.help.noAvailableArgs');

				// Prepare embed output
				const embedMsg = new Discord.MessageEmbed()
					.setAuthor(i18n.__('plugin.help.help', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
					.setColor(3447003)
					.setTitle(i18n.__('plugin.help.command') + ': `' + found.label + '`')
					.addField(i18n.__('plugin.help.description'), found.description)
					.addField(i18n.__('plugin.help.arguments'), argsStr);

				resolve(embedMsg);
			} else {
				// Command not found
				reject(new Error(i18n.__('plugin.help.error.commandNotFound', command)));
			}
		});
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	addCommandHelp = (command: Command): void => {
		this.commandList.push(command);
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	addCommandsHelp = (commandList: Command[]): void => {
		this.commandList = this.commandList.concat(commandList);
	}
}