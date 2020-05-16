import * as fileData from '../config.json';

// TODO: Make it a Singleton. Complete it with more methods for data retrieving.
export class Config {
	getConfig() {
		return fileData;
	}
}