import { Plugin } from '@classes/Plugin.class';
import { EventHandler } from '@classes/EventHandler.class';
import { Command } from '@classes/Command.class';
import { UserRepository } from '@persistence/repositories/userRepository';
import { validateBTag } from '@helpers/functions';
import { getDB, getI18N } from '@helpers/bootstrapper';
import { BotPlugin } from '@decorators/BotPlugin';

@BotPlugin('manageuserbtag')
export class ManageUserBTagPlugin extends Plugin {
	constructor() {
		super('Manage user Battle Tag', {});

		const i18n = getI18N();
		const linkUserBTagArgs: CommandArgument[] = [{
			'tag': i18n.translate('plugin.manageUserBTag.link.args.btag.tag'),
			'desc': i18n.translate('plugin.manageUserBTag.link.args.btag.desc'),
			'optional': false,
		}];
		const linkUserBTagCmd = new Command('vincular', 'Link BattleTag', i18n.translate('plugin.manageUserBTag.link.desc'), this.linkUserBTag, CommandLevel.Everyone, [], linkUserBTagArgs);
		super.addCommand(linkUserBTagCmd);
		const unlinkUserBTagCmd = new Command('desvincular', 'Unlink BattleTag', i18n.translate('plugin.manageUserBTag.unlink.desc'), this.unlinkUserBTag);
		super.addCommand(unlinkUserBTagCmd);
	}

	private async linkUserBTag(fParams: Record<string, any>, args: string[]): Promise<string> {
		const userID = fParams.message.author.id;
		const userName = fParams.message.author.username;

		const btag = args[0];

		const i18n = getI18N();
		const DB = await getDB();
		const userRepository = await DB.getRepository(UserRepository);
		return new Promise((resolve, reject) => {
			if (!validateBTag(btag)) {
				reject(new Error(i18n.translate('plugin.manageUserBTag.link.error.notValid')));
			} else {
				userRepository.setBTag(btag, userID)
				.then (() => {
					resolve(i18n.translate('plugin.manageUserBTag.link.ok', userName));
				})
				.catch(() => {
					reject(new Error(i18n.translate('plugin.manageUserBTag.link.error.writeError', userName)));
				});
		}
		});
	}

	private async unlinkUserBTag(fParams: Record<string, any>, args: string[]): Promise<string> {
		const userID = fParams.message.author.id;
		const userName = fParams.message.author.username;
		const btag: null = null;

		const i18n = getI18N();
		const DB = await getDB();
		const userRepository = await DB.getRepository(UserRepository);
		return new Promise((resolve, reject) => {
			userRepository.setBTag(btag, userID)
			.then (() => {
				resolve(i18n.translate('plugin.manageUserBTag.unlink.ok', userName));
			})
			.catch(() => {
				reject(new Error(i18n.translate('plugin.manageUserBTag.unlink.error', userName)));
			});
		});
	}

}