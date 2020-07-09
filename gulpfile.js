const gulp = require('gulp');
const tsimport = require('./gulp-scripts/tsimport/tsimport');
const ts = require('gulp-typescript');

// Gulp Task
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

	console.log(`[Config]: Copying config into ./${tsProject.config.compilerOptions.outDir}/config`)
	gulp.src('./src/config/*.json')
		.pipe(gulp.dest(`./${tsProject.config.compilerOptions.outDir}/config`));

	console.log(`[Locales]: Copying locales into ./${tsProject.config.compilerOptions.outDir}/locales`)
	gulp.src('./src/locales/**/*.json')
		.pipe(gulp.dest(`./${tsProject.config.compilerOptions.outDir}/locales`));
});