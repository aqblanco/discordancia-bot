const through = require('through2');

const replacePath = require('./replace-path.js');

module.exports = function(importOptions) {
	return through.obj(function(file, enc, cb) {
		let code = file.contents.toString('utf8');

		const rootPath = importOptions.outDir || importOptions.baseUrl;
		code = replacePath(code, file.history.toString(), rootPath, importOptions.paths);

		file.contents = Buffer.from(code);
		this.push(file);
		cb();
	});

};