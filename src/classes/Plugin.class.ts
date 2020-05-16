import { Command } from '@classes/Command.class';
import { EventHandler } from '@classes/EventHandler.class';

export class Plugin {
	private _name: string;
	private _commands: Command[];
	private _eventHandlers: EventHandler<any>[];
	private _status: PluginStatus;
	private _canBeDisabled: boolean;

	constructor(name: string, commands: Command[] = [], eventHandlers: EventHandler<any>[] = [], canBeDisabled = true) {
		this._name = name;
		this._commands = commands;
		this._eventHandlers = eventHandlers;
		this._status = PluginStatus.Enabled;
		this._canBeDisabled = canBeDisabled;
	}

	addCommand(command: Command) {
		this._commands.push(command);
	}

	addEventHandler(eventHandler: EventHandler<any>) {
		this._eventHandlers.push(eventHandler);
	}

	get commands(): Command[] {
		return this._commands;
	}

	get eventHandlers(): EventHandler<any>[] {
		return this._eventHandlers;
	}
}