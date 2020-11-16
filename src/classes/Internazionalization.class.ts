import { find } from "@helpers/functions";
import { PathLike } from "fs";
import i18nInstance, { ConfigurationOptions } from 'i18n';
import { injectable, inject } from "tsyringe";

export class Internazionalization {
	private _config: I18nConfig;
	private _path: PathLike;
	private _i18nInstance: typeof i18nInstance;

	constructor (config: I18nConfig, path: PathLike) {
		this._config = config;
		this._path = path;
		this._i18nInstance = i18nInstance;
	}

	get supportedLocales(): readonly string[] {
		return this._config.supportedLocales;
	}

	initialize() {
		if (!this.isSupported(this._config.currentLocale)) throw new Error('Current language is not supported');

		const i18nCfg: ConfigurationOptions = {
			locales: this._config.supportedLocales,
			defaultLocale: this._config.currentLocale,
			directory: this._path.toString(),
			objectNotation: true,
		};

		this._i18nInstance.configure(i18nCfg);
	}

	translate(str: string, ...replace: string[]) {
		let translatedStr =  this._i18nInstance.__(str, ...replace);
		return translatedStr;
	}
	
    isSupported(locale: string): boolean {
        return this.containsNormalized(this.supportedLocales, locale);
	}
	
	private containsNormalized (arr: ReadonlyArray<string>, item: string): boolean {
		const normalizedItem = this.normalize(item);
	
		return !!find(
			arr,
			(curr) => this.normalize(curr) === normalizedItem,
		);
	}
	
	private normalize(locale: string): string {
		return locale.replace('_', '-').toLowerCase();
	}
	
	private languageCode(locale: string): string {
		return locale.split('-')[0];
	}
}