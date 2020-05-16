import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import { UserRepository } from '@persistence/repositories/userRepository';
import { i18n, validateBTag } from '@helpers/functions';
import { getDB } from '@helpers/initialize';

export class ManageUserBTagPlugin extends Plugin {
	constructor() {
		super('Manage user Battle Tag', [], []);

		const linkUserBTagArgs: CommandArgument[] = [{
			'tag': i18n.__('plugin.manageUserBTag.link.args.btag.tag'),
			'desc': i18n.__('plugin.manageUserBTag.link.args.btag.desc'),
			'optional': false,
		}];
		const linkUserBTagCmd = new Command('vincular', 'Link BattleTag', i18n.__('plugin.manageUserBTag.link.desc'), this.linkUserBTag, CommandLevel.Everyone, [], linkUserBTagArgs);
		super.addCommand(linkUserBTagCmd);
		const unlinkUserBTagCmd = new Command('desvincular', 'Unlink BattleTag', i18n.__('plugin.manageUserBTag.unlink.desc'), this.unlinkUserBTag);
		super.addCommand(unlinkUserBTagCmd);
	}

	private async linkUserBTag(fParams: Record<string, any>, args: string[]): Promise<string> {
		const userID = fParams.message.author.id;
		const userName = fParams.message.author.username;

		const btag = args[0];

		const DB = await getDB();
		const userRepository = await DB.getRepository(UserRepository);
		return new Promise((resolve, reject) => {
			if (!validateBTag(btag)) {
				reject(new Error(i18n.__('plugin.manageUserBTag.link.error.notValid')));
			} else {
				userRepository.setBTag(btag, userID)
				.then (() => {
					resolve(i18n.__('plugin.manageUserBTag.link.ok', userName));
				})
				.catch(() => {
					reject(new Error(i18n.__('plugin.manageUserBTag.link.error.writeError', userName)));
				});
		}
		});
	}

	private async unlinkUserBTag(fParams: Record<string, any>, args: string[]): Promise<string> {
		const userID = fParams.message.author.id;
		const userName = fParams.message.author.username;
		const btag: null = null;

		const DB = await getDB();
		const userRepository = await DB.getRepository(UserRepository);
		return new Promise((resolve, reject) => {
			userRepository.setBTag(btag, userID)
			.then (() => {
				resolve(i18n.__('plugin.manageUserBTag.unlink.ok', userName));
			})
			.catch(() => {
				reject(new Error(i18n.__('plugin.manageUserBTag.unlink.error', userName)));
			});
		});
	}

}