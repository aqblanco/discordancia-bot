import { ConfigType } from "@classes/ConfigType.class";
import { singleton, injectable, inject } from "tsyringe";

@injectable()
export class ConfigManager<T extends ConfigType, S extends ConfigOptionsStructure> {
	private _config: S;
	private _configType: T;
	private _env: string;

	constructor(@inject("Environment") env: string, @inject("ConfigType") configType: T) {
		this._configType = configType;
		this._config = null;
		this._env = env;
	}

	get configuration(): S {
		return this._config;
	}

	public readConfig(): void {
		this._config = this._configType.readConfig(this._env);
	}

	public async writeConfig(): Promise<void> {
		await this._configType.writeConfig(this._config);
	}
}