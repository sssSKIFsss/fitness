// gulp                  - development version
// gulp --production     - production version

'use strict';

// VARIABLES ------------------------------------------------------------------
var gulp = require('gulp');

// получает аргумент из командной строки
var isProduction = require('yargs').argv.production;

// параметры совместимости с браузерами
var browsers = 'ie >= 10';
var users = '> 10%';
var ignoreCssFiles = ['**/bower_components/**/*.*css',
	'**/lib/**/*.*css', '**/font/**/*.css',
	'**/tmp/**/*.css', '**/temp/**/*.css'];

// js объект в который пропишем все нужные нам пути
var path = {
	src: {
		htaccess: ['.htaccess', 'src/favicon.ico'],
		html: 'src/*.html',
		js: {
			header: 'src/js/header/*.js',
			footer: 'src/js/footer/*.js'
		},
		style: {
			abstract: [
				'src/style/abstract/*.scss',
				'src/style/base/*.scss',
				'src/style/layout/*.scss',
				'src/style/module/*.scss',
				'src/style/state/*.scss',
				'src/style/theme/*.scss',
				'src/style/sprite/*.scss'
			],
			main: [
				'src/style/base/*.scss',
				'src/style/layout/*.scss',
				'src/style/module/*.scss',
				'src/style/state/*.scss',
				'src/style/theme/*.scss',
				'src/style/sprite/*.scss'
			]
		},
		img: [
			'src/img/**/*.{png,jpg,gif,gz}',
			'!src/img/sprite/**/*.*'
		],
		font: 'src/font/**/*.{otf,eot,svg,ttf,woff,woff2,gz}'
	},
	dst: {
		dir: 'build/',
		js: {
			dir: 'js/',
			fileHeader: 'header.js',
			fileFooter: 'footer.js'
		},
		css: {
			dir: 'css/',
			file: 'style.css'
		},
		imgDir: 'images/',
		fontDir: 'fonts/'
	},
	manifest: {
		dir: 'manifest/',
		htmlUrl: 'html_url.json',
		cssUrl: 'css_url.json',
		jsUrl: 'js_url.json',
		cssHash: 'css_hash.json',
		jsHeaderHash: 'js_header_hash.json',
		jsFooterHash: 'js_footer_hash.json'
	},
	watch: {
		html: ['src/*.html', 'skif_components/**/*.html'],
		style: {
			abstract: 'src/style/abstract/*.scss',
			main: [
				'!src/style/abstract/*.scss',
				'src/style/**/*.scss',
				'skif_components/**/*.scss',
				'src/img/sprite/**/*.*'
			]
		},
		js: ['src/js/**/*.js', 'skif_components/**/*.js'],
		img: ['src/img/**/*.{png,jpg,gif}', '!src/img/sprite/**/*.*'],
		font: 'src/font/**/*.*'
	}
};

// вызов тасков через require из task-файлов
function lazyRequireTask(taskName, taskPath, options) {
	var option = options || {};
	option.taskName = taskName;
	option.isProduction = isProduction;
	gulp.task(taskName, function(callback) {
		var task = require(taskPath).call(this, option);
		return task(callback);
	});
}

// TASKS ---------------------------------------------------------------------

// очистка папки build
lazyRequireTask('clean', './gulp_tasks/clean', {
	src: path.dst.dir,
	cssHash: path.manifest.dir + path.manifest.cssHash,
	jsHeaderHash: path.manifest.dir + path.manifest.jsHeaderHash,
	jsFooterHash: path.manifest.dir + path.manifest.jsFooterHash
});

// Веб сервер +
lazyRequireTask('server', './gulp_tasks/server', {
	src: path.dst.dir + '**/*.*'
});

// Перенос htaccess и favicon +
lazyRequireTask('htaccess', './gulp_tasks/copy', {
	src: path.src.htaccess,
	dst: path.dst.dir
});

// Перенос шрифтов +
lazyRequireTask('font', './gulp_tasks/copy', {
	src: path.src.font,
	dst: path.dst.dir + path.dst.fontDir
});

// Сборка html +
lazyRequireTask('html', './gulp_tasks/html', {
	src: path.src.html,
	dst: path.dst.dir,
	htmlUrl: path.manifest.dir + path.manifest.htmlUrl,
	cssHash: path.manifest.dir + path.manifest.cssHash,
	jsHeaderHash: path.manifest.dir + path.manifest.jsHeaderHash,
	jsFooterHash: path.manifest.dir + path.manifest.jsFooterHash
});

// Сборка css:
lazyRequireTask('full_css', './gulp_tasks/css', {
	browser: browsers,
	user: users,
	ignoreFiles: ignoreCssFiles,
	src: path.src.style.abstract,
	dst: {
		css: {
			dir: path.dst.dir + path.dst.css.dir,
			file: path.dst.css.file
		},
		imgDir: path.dst.dir + path.dst.imgDir
	},
	mn: {
		dir: path.manifest.dir,
		cssUrl: path.manifest.cssUrl,
		cssHash: path.manifest.cssHash
	}
});
lazyRequireTask('partial_css', './gulp_tasks/css', {
	browser: browsers,
	user: users,
	ignoreFiles: ignoreCssFiles,
	src: path.src.style.main,
	dst: {
		css: {
			dir: path.dst.dir + path.dst.css.dir,
			file: path.dst.css.file
		},
		imgDir: path.dst.dir + path.dst.imgDir
	},
	mn: {
		dir: path.manifest.dir,
		cssUrl: path.manifest.cssUrl,
		cssHash: path.manifest.cssHash
	}
});

// Сборка js:
lazyRequireTask('js_header', './gulp_tasks/js', {
	src: path.src.js.header,
	dst: {
		dir: path.dst.dir + path.dst.js.dir,
		file: path.dst.js.fileHeader
	},
	mn: {
		dir: path.manifest.dir,
		url: path.manifest.jsUrl,
		hash: path.manifest.jsHeaderHash
	}
});

lazyRequireTask('js_footer', './gulp_tasks/js', {
	src: path.src.js.footer,
	dst: {
		dir: path.dst.dir + path.dst.js.dir,
		file: path.dst.js.fileFooter
	},
	mn: {
		dir: path.manifest.dir,
		url: path.manifest.jsUrl,
		hash: path.manifest.jsFooterHash
	}
});

// Перенос картинок +
lazyRequireTask('img', './gulp_tasks/img', {
	src: path.src.img,
	dst: path.dst.imgDir
});

// Сборка проекта
gulp.task('build',
	gulp.series(
		'clean',
		gulp.parallel(
			'htaccess',
			'font',
			'img',
			'js_header',
			'js_footer',
			'full_css'
		),
		// html зависит от хеш-сумм js и css файлов при продакшене
		'html'
	)
);

// Таск-watcher:
gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.style.abstract, gulp.series('full_css'));
	gulp.watch(path.watch.style.main, gulp.series('partial_css'));
	gulp.watch(path.watch.js, gulp.series('js_header', 'js_footer'));
	gulp.watch(path.watch.img, gulp.series('img'));
	gulp.watch(path.watch.font, gulp.series('font'));
});

// Итоговый таск - Development
gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));

/*
	// отслеживание работы gulp через плагин gulp-debug

	const debug = require('gulp-debug');
	gulp.task('html:build', function () {
		return gulp.src(path.src.html) //Выберем файлы по нужному пути
			.pipe(debug({title: 'src'})) // дебажим src
			.pipe(rigger())
			.pipe(debug({title: 'rigger'})) // дебажим rigger
			.pipe(gulp.dest(path.dst.html)); //Выплюнем их в папку build
	});

// вывод на консоль содержимого потока в виде файлов

	gulp.task('html:build', function () {
		return gulp.src(path.src.html)
			.on('data', function(file){
				console.log({
					// main components
					contents: file.contents,
					path:     file.path,
					cwd:      file.cwd,
					base:     file.base,
					// component helpers
					relative: file.relative,
					dirname:  file.dirname,
					stem:     file.stem,
					extname:  file.extname
				});
			})
			.pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
	});
*/
