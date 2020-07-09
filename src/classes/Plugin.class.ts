import { Command } from '@classes/Command.class';
import { EventHandler } from '@classes/EventHandler.class';
import { getPath } from '@helpers/functions';
import { ConfigFile } from '@classes/ConfigFile.class';
import { ConfigManager } from '@classes/ConfigManager.class';
import { ConfigType } from '@classes/ConfigType.class';
import { container } from 'tsyringe';

export class Plugin {
	private _name: string;
	private _commands: Command[];
	private _eventHandlers: EventHandler<any>[];
	private _configOptions: PluginConfigOptions;
	private _config: ConfigManager<ConfigType, ConfigOptionsStructure>;
	private _status: PluginStatus;
	private _canBeDisabled: boolean;

	constructor(name: string, commands: Command[] = [], eventHandlers: EventHandler<any>[] = [], configOptions: PluginConfigOptions = null, canBeDisabled = true) {
		this._name = name;
		this._commands = commands;
		this._eventHandlers = eventHandlers;
		if (configOptions != null) {
			this._configOptions = configOptions;
			let cfgPath = null;
			if (this._configOptions.name != null && this._configOptions.name != '') {
				cfgPath = `${getPath('config')}${this._configOptions.name}`;
			}

			if (cfgPath != null && configOptions.structure != {}) {
				const configFile = new ConfigFile(cfgPath);
				container.register("ConfigFile", { useValue: cfgPath });
				container.register("ConfigType", { useValue: configFile });
				container.register("Environment", { useValue: 'development' });
				this._config = container.resolve<ConfigManager<ConfigFile, typeof configOptions.structure>>(ConfigManager);
			} else {
				this._configOptions.name = '';
				this._configOptions.structure = {};
				this._config = null
			}
			
		} else {
			this._configOptions = null;
			this._config = null;
		}
		
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

	get configManager(): ConfigManager<ConfigType, ConfigOptionsStructure> {
		return this._config;
	}

	get configuration(): ConfigOptionsStructure {
		if (this._config) {
			return this._config.configuration;
		} else {
			return {};
		}
		
	}
}