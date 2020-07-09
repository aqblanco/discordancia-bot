export abstract class ConfigType {
	public abstract readConfig<S extends ConfigOptionsStructure>(env: string): S;
	public abstract async writeConfig<S extends ConfigOptionsStructure>(config: S): Promise<void>;
}