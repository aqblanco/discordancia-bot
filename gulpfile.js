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
});