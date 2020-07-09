import { ConfigType } from '@classes/ConfigType.class';
import { inject } from 'tsyringe';

export class ConfigFile extends ConfigType {
	private _path: string;

	constructor(@inject("ConfigFile") path: string) {
		super();
		this._path = path;
	}

	public readConfig<S extends ConfigOptionsStructure>(env: string): S {
		const data = require(this._path);

		return data[env];
	}

	public async writeConfig<S extends ConfigOptionsStructure>(config: S): Promise<void> {
		const fs = require('fs').promises;
		await fs.writeFile(this._path, JSON.stringify(config));
	}
}