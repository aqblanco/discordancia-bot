/*import { ModelAttributes, ModelOptions } from "sequelize/types";
import { getGlobal } from "@helpers/functions";

export function Entity(name: string, attr: ModelAttributes, options: ModelOptions): Function {
	return function (target: Function) {
		console.log("Decorator")
		getGlobal().entities.push({
			target: target,
			name: name,
			attr: attr,
			options: options
		});
	};
}*/