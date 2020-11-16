const gulp = require('gulp');
const tsimport = require('./gulp-scripts/tsimport/tsimport');
const ts = require('gulp-typescript');
const jsonToTsd = require('gulp-json-to-tsd');

// Fetch command line arguments
const arg = (argList => {

	let arg = {}, a, opt, thisOpt, curOpt;
	for (a = 0; a < argList.length; a++) {
		thisOpt = argList[a].trim();
		opt = thisOpt.replace(/^\-+/, '');

		if (opt === thisOpt) {
			// Argument value
			if (curOpt) arg[curOpt] = opt;
			curOpt = null;
		} else {
			// Argument name
			curOpt = opt;
			arg[curOpt] = true;
		}
	}

	return arg;

})(process.argv);
  

// Main Task
gulp.task('default', function(done) {
	console.log('[Typescript]: Transpiling Source');
	const tsProject = ts.createProject('tsconfig.json', {
		typescript: require('typescript'),
	});

	gulp.src('src/**/*.ts')
		.pipe(tsProject())
		.pipe(tsimport(tsProject.config.compilerOptions))
		.on('error', function(error, callback) {
			console.error(error.stack);
			this.emit('end');
		})
		.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
		.on('end', done);
	
	console.log('[Locales]: Copying Locales');	
	gulp.src([
        'locales/**/*.json',     
    ]).pipe(gulp.dest('dist/locales'));
});