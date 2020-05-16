import { PathLike } from 'fs';

export class ResourceManager {
	private _basePath: PathLike;
	private _resourceList: Map<ResourceCategory, Resource[]>;

	constructor(basePath: PathLike, resourceList = new Map<ResourceCategory, Resource[]>()) {
		this._basePath = basePath;
		this._resourceList = resourceList;
	}

	addResource(resource: Resource, category: ResourceCategory) {
		this._resourceList.get(category).push(resource);
	}

	getResourcePath(resourceName: string, category: ResourceCategory) {
		let found = false;
		let result = '';
		const path = this._basePath;
		this._resourceList.get(category).forEach(function(e) {
			if (e.name == resourceName && !found) {
				result = path + e.file;
				found = true;
			}
		});

		return result;
	}

	getResourceList(category: ResourceCategory) {
		const list: Resource[] = [];
		this._resourceList.get(category).forEach(function(e) {
			list.push(e);
		});

		return list;
	}
};