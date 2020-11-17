import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import * as Discord from 'discord.js';
import { ServerRepository } from '@persistence/repositories/serverRepository';
import { getDB, getI18N } from '@helpers/bootstrapper';
import { ServerEntity } from '@persistence/entities/Server';
import { UserServerRepository } from '@persistence/repositories/userServerRepository';
import { BotPlugin } from '@decorators/BotPlugin';

@BotPlugin('servermotd')
export class ServerMotDPlugin extends Plugin {
	constructor() {
		super('Server Message of the Day', {});

		const i18n = getI18N();
		const motdArgs: CommandArgument[] = [{
			'tag': i18n.translate('plugin.serverMotD.args.newMessage.tag'),
			'desc': i18n.translate('plugin.serverMotD.args.newMessage.desc'),
			'optional': true,
		}];

		const serverMotDCmd = new Command('motd', 'Message of the Day', i18n.translate('plugin.serverMotD.desc'), this.motd, CommandLevel.BotManager, [], motdArgs);
		super.addCommand(serverMotDCmd);

		const onConnectWelcomeEvent = new EventHandler<"presenceUpdate">("presenceUpdate", this.onConnectWelcome);
		super.addEventHandler(onConnectWelcomeEvent);
	}

	private async onConnectWelcome(oldMember: Discord.Presence, newMember: Discord.Presence): Promise<void> {
		// Interval of days to show MotD if it has not changed
		const daysInterval = 7;

		const i18n = getI18N();

		// Trigger when coming from offline
		if (!oldMember || oldMember.status === 'offline') {
			let lastCon: Date = null;
			// Get user last connection to server
			const DB = await getDB();
			const userServerRepository = await DB.getRepository(UserServerRepository);
			const serverRepository = await DB.getRepository(ServerRepository);
			userServerRepository.getLastConnection(newMember.user.id, newMember.guild.id)
			.then(data => {
				lastCon = data;
				// Update last connection with current date
				return userServerRepository.setLastConnection(newMember.user.id, newMember.guild.id, new Date());
			})
			.then(() => {
				// Get MotD
				return serverRepository.getMotD(newMember.guild.id);
			})
			.then((data) => {
				if (data != null) {
					const motdTxt = data.motd;
					let daysLastChange;
					if (lastCon != null) {
						// Not first connection, check message changed, or previous connection not in the same day
						const lastConDate = new Date(lastCon);
						daysLastChange = lastConDate.getDate() - new Date().getDate();
					} else {
						// First connection, force showing motd
						daysLastChange = daysInterval;
					}

					const changed = data.updatedAt > lastCon;
					// Check if the MotD changed since last connection or user's lastest connection wasn't on the same day
					if (changed || daysLastChange >= daysInterval) {
						// PM with welcome message to non-bot users
						if (!newMember.user.bot) {
							newMember.user.send(`***${i18n.translate('plugin.serverMotD.motd')}${`***: ${motdTxt}`}`)
								// TODO: Translation
								.then(() => console.log(`MotD enviado al usuario ${newMember.user.username}`))
								.catch(console.error);
						}
					}
				}
			});
		}
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private motd = async (fParams: Record<string, any>, args: string[]): Promise<Discord.MessageEmbed> => {
		const message = fParams.message;

		const DB = await getDB();
		const serverRepository = await DB.getRepository(ServerRepository);
		return new Promise ((resolve, reject) => {
			let motdTxt = '';
			// Display current MotD
			if (args.length == 0) {
				serverRepository.getMotD(message.guild.id)
				.then((data: ServerEntity) => {
					if (data) {
						motdTxt = data.motd;
					}
					this.displayMotd(motdTxt)
					.then((msg) => {
						resolve(msg);
					})
					.catch((e) => {
						reject(e);
					});
				});
				// Update MotD
			} else {
				// Create a string from the args, that is, the motd
				motdTxt = args.join(' ');
				serverRepository.setMotD(message.guild.id, motdTxt)
				.then(() => {
					this.displayMotd(motdTxt)
					.then((msg) => {
						resolve(msg);
					})
					.catch((e) => {
						reject(e);
					});
				});
			}
		});

	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private displayMotd = (msg: string): Promise<Discord.MessageEmbed> => {
		const i18n = getI18N();
		return new Promise((resolve, reject) => {
			if (msg != null && msg != '') {
				const embedMsg =new Discord.MessageEmbed()
					.setAuthor(i18n.translate('plugin.serverMotD.motd', 'https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/favicon.png'))
					.setColor(3447003)
					.setDescription(msg);

				resolve(embedMsg);
			} else {
				reject(new Error(i18n.translate('plugin.serverMotD.error.noMotDSet')));
			}
		});
	}

	// Needs to be declared as an attribute because of it making calls to other internal methods
	private motdChanged = (lastLoginDate: Date, motdChangeDate: Date): boolean => {
		const res = motdChangeDate > lastLoginDate;
		return res;
	}

	// Gets difference in days between two dates
	// Needs to be declared as an attribute because of it making calls to other internal methods
	private daysDifference = (d1: Date, d2: Date): number => {
		return d2.getDate() - d1.getDate();
	}

}