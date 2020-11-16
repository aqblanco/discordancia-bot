import * as Discord from 'discord.js';
import { dirname, resolve } from 'path';
import { getConfigManager } from '@helpers/bootstrapper';

export function getRandomStr (list: string[]): string {
	const item = list[Math.floor(Math.random() * list.length)];
	return (item);
};

export function getPath (folder = 'appRoot'): string {
	const basePath = dirname(require.main.filename) || process.mainModule.filename;
	const rootPath = resolve(basePath, '..');
	let path = '';
	switch (folder) {
	case 'classes':
		path = `${basePath}/classes/`;
		break;
	case 'assets':
		path = `${rootPath}/assets/`;
		break;
	case 'plugins':
		path = `${basePath}/plugins/`;
		break;
	case 'config':
		path = `${rootPath}/config/`;
		break;
	case 'root':
		path = rootPath;
		break;
	case 'appBase':
	default:
		path = basePath;
	}

	return (path);
};

export function formatError (msg: string): Discord.MessageEmbed {
	const embed = new Discord.MessageEmbed()
		.setAuthor('Error', 'https://freeiconshop.com/wp-content/uploads/edd/error-flat.png')
		.setColor('#b71c1c')
		.setDescription(msg);

	return embed;
};

// TODO: Rework this. Move into Plugin class, check before registering into bot
export function pluginIsEnabled(name: string): boolean {
	//const rootPath = module.exports.getPath();
	const configManager = getConfigManager();
	const config = configManager.configuration;

	return config.botConfig.enabledPlugins.includes(name);
};

export function validateBTag(btag: string): boolean {
    // From the naming policy: http://us.battle.net/support/en/article/battletag-naming-policy
    /*
    BattleTags must be between 3-12 characters long.
    Accented characters are allowed.
    Numbers are allowed, but a BattleTag cannot start with a number.
    Mixed capitals are allowed (ex: TeRrAnMaRiNe).
    No spaces or symbols are allowed (“, *, #, +, etc…).
     */
    const pattern = /^\D.{2,11}#\d{4}$/u;
    return pattern.test(btag);
}

// Initialize internacionalization support
/*import i18nInstance from 'i18n';

i18nInstance.configure({
	locales: ['en', 'es'],
	defaultLocale: 'en',
	directory: getPath('root') + '/locales',
	objectNotation: true,
});

export const i18n = i18nInstance;*/

export function find<T>(
    array: ReadonlyArray<T> | Array<T>,
    predicate: (item: T, index?: number, obj?: ReadonlyArray<T> | Array<T>) => boolean,
): T | undefined {
    if (typeof Array.prototype.find === 'function') {
        return (array as Array<T>).find(predicate);
    }
}