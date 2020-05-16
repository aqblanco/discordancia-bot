import * as Discord from 'discord.js';
export class EventHandler<E extends keyof Discord.ClientEvents> {
	private _event: keyof Discord.ClientEvents;
	private _listener: (...args: Discord.ClientEvents[E]) => void;

	constructor(event: keyof Discord.ClientEvents, listener: (...args: Discord.ClientEvents[E]) => void) {
		this._event = event;
		this._listener = listener;
	}

	get event(): keyof Discord.ClientEvents {
		return this._event;
	}

	get listener(): (...args: Discord.ClientEvents[E]) => void {
		return this._listener;
	}
}