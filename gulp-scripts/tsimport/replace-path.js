const fs = require('fs');
const path = require('path');

module.exports = function(code, filePath, rootPath, targetPaths) {
	const tscpaths = Object.keys(targetPaths);

	const lines = code.split('\n');

	return lines.map((line) => {
		const matches = [];
		// const imatches = [];
		const require_matches = line.match(/require\(('|")(.*)('|")\)/g);
		// const import_matches = line.match(/import ('|")(.ts)('|")/g);

		Array.prototype.push.apply(matches, require_matches);
		// Array.prototype.push.apply(imatches, import_matches);

		if(!matches /*|| !imatches*/) {
			return line;
		}


		// Go through each require statement
		for(const match of matches) {
			// Find each paths
			for(const tscpath of tscpaths) {
				// Find required module & check if its path matching what is described in the paths config.
				const requiredModules = match.match(new RegExp(tscpath, 'g'));

				if(requiredModules && requiredModules.length > 0) {
					for(const requiredModule of requiredModules) {
						// Skip if it resolves to the node_modules folder
						const modulePath = path.resolve('./node_modules/' + tscpath);
						if (fs.existsSync(modulePath)) {
							continue;
						}

						// Get relative path and replace
						const sourcePath = path.dirname(filePath);
						const targetPath = path.dirname(path.resolve(rootPath + '/' + targetPaths[tscpath]));

						const relativePath = path.relative(sourcePath, targetPath);

						line = line.replace(new RegExp(tscpath, 'g'), './' + relativePath + '/');

					}
				}
			}
		}

		return line;
	}).join('\n');
};