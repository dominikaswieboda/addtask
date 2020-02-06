var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var styleSRC = 'src/scss/main.scss';
var styleDIST = './dist/css/';
var styleWatch = 'src/scss/**/*.scss';

var jsSRC = 'scripts.js';
var jsFolder = 'src/js/';
var jsDIST = './dist/js/';
var jsWatch = 'src/js/**/*.js';
var jsFiles = [jsSRC];


gulp.task('style', function () {
	gulp.src(styleSRC)
		.pipe(sourcemaps.init())
		.pipe(sass({
			errorLogToConsole: true,
			outputStyle: 'compressed'
		}))
		.on('error', console.error.bind(console))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(styleDIST));
});

gulp.task('js', function () {
	jsFiles.map(function (entry) {
		return browserify({
			entries: [jsFolder + entry]
		})
			.transform(babelify, {
				presets: ['env']
			})
			.bundle()
			.pipe(source(entry))
			.pipe(rename({
				extname: '.min.js'
			}))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(jsDIST))
	});
});

gulp.task('default', ['style', 'js']);

gulp.task('watch', ['default'], function () {
	gulp.watch(styleWatch, ['style']);
	gulp.watch(jsWatch, ['js']);
});