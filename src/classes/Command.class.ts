/** Class representing a command. */
import * as Discord from 'discord.js';
export class Command {

	private _label: string;
	private _name: string;
	private _desc: string;
	private _f: Function;
	private _cmdLevel: CommandLevel;
	private _fParams: Record<string, any>;
	private _argumentList: CommandArgument[];

	/**
	 * Create a command object.
	 * @constructor
	 * @param {string} label - The string used to identify and call the command.
	 * @param {string} name - The command name to use in the UI.
	 * @param {string} desc - What does the command do.
	 * @param {function} f - Function to be executed when the command is called.
	 * @param {CommandLevel} [cmdLevel=CommandLevel.Everyone] - Is this command only available to everyone (0), bot's manager group and admins (1) or admin users (2)
	 * @param {Record<string, any>} [fParams=[]] - Parameters used by the function f (Optional).
	 * @param {CommandArgument[]} argumentList - Arguments that the command may accept (Optional).
	 * @param {string} argumentList.tag - String used to identify the command.
	 * @param {string} argumentList.desc - What is that argument for.
	 * @param {boolean} argumentList.optional - Is the argument optional.
	 */
	constructor(label: string, name: string, desc: string, f: Function, cmdLevel = CommandLevel.Everyone, fParams: any[] = [], argumentList: CommandArgument[] = []) {
		this._label = label;
		this._name = name;
		this._desc = desc;
		this._f = f;
		this._cmdLevel = cmdLevel;
		this._fParams = fParams;
		this._argumentList = argumentList;
	}

	get label(): string {
		return this._label;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._desc;
	}

	get argumentList(): CommandArgument[] {
		return this._argumentList;
	}

	userCanExecute(user: Discord.GuildMember): boolean {
		let res = false;
		const isAdmin = user.hasPermission('ADMINISTRATOR');
		// TODO: Check bot manager group
		const isBotManager = false;

		switch (this._cmdLevel) {
			case CommandLevel.Admin:
				res = isAdmin;
				break;
			case CommandLevel.BotManager:
				res = isBotManager || isAdmin;
				break;
			case CommandLevel.Everyone:
			default:
				res = true;
		}

		return res;
	}

	addFParams(newParams: Record<string, any>) {
		for (const key in newParams) {
			this._fParams[key] = newParams[key];
		}
	}

	execute(args: Object[]): Promise<string | Object> {
		const f = this._f;
		const fParams = this._fParams;

		return new Promise((resolve, reject) => {
			f(fParams, args)
				.then((result: Promise<string | Object>) => {
					resolve(result);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}
};