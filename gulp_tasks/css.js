'use strict';

// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// ДВИЖОК GULP ===========================
var gulp = require('gulp');
// реализация оператора if
var IF = require('gulp-if');
// фильтрация неизменённых файлов
var cached = require('gulp-cached');
// сохранение инфы о компилировании
var sourcemaps = require('gulp-sourcemaps');
// компиляция scss в css
var sass = require('gulp-sass');
// замена урлов
var revReplace = require('gulp-rev-replace');
// подтягивание к компилированию неизменённых файлов
var remember = require('gulp-remember');
// склеивание винил-файлов
var concat = require('gulp-concat');
// минификация файла
var cssnano = require('gulp-cssnano');
// переименование css-файла в хеш-сумму
var rev = require('gulp-rev');
// вывод сообщений об ошибках на экран
var notify = require('gulp-notify');
// ДВИЖОК POSTCSS ============================
var postcss = require('gulp-postcss');
// чтение scss формата в css-формате
var scss = require('postcss-scss');
var sprites = require('postcss-sprites');
// автопрефикс и CSS4
var cssnext = require('postcss-cssnext');
// CSS-линтер
var stylelint = require('stylelint');
// проверка близкого совпадения цветов
var colorguard = require('colorguard');
// форматированный вывод сообщений на экран
var reporter = require('postcss-reporter');
var debug = require('gulp-debug');

// Сборка scss:
module.exports = function (opt) {
	return function () {
		// очистка кеша при старте или
		// при изменении abstract-CSS-файлов
		if(opt.taskName === 'full_css') {
			delete cached.caches.style;
		}
		// обёртка для отслеживания ошибок
		return combiner(
			// чтение исходных файлов
			gulp.src(opt.src),
			debug({title: 'src'}),
			// отслеживание изменений при компиляции файла
			IF(!opt.isProduction, sourcemaps.init()),

			// фильтрация неизменённых файлов
			// в скобках не путь, а просто название кеша
			cached('style'),
			debug({title: 'cached'}),
			// движок  PostCSS
			postcss([
				// CSS-линтер
				stylelint(),
				// реализация @import scss,css-файлов в т.ч. для bootstrap
				require('postcss-easy-import')({
					extensions: ['.scss'],
					prefix: '_'
				}),
				// автопрефикс и CSS4
				cssnext(),
				// спрайты
				// SVG
				sprites({
					stylesheetPath: opt.dst.css.dir,
					spritePath: opt.dst.imgDir,
					relativeTo: 'rule',
					filterBy: function(image) {
						if(!/img\/sprite\/svg/.test(image.url)) {
							return Promise.reject();
						}
						return Promise.resolve();
					}
				}),
				// PNG
				sprites({
					stylesheetPath: opt.dst.css.dir,
					spritePath: opt.dst.imgDir,
					relativeTo: 'rule',
					retina: true,
					filterBy: function(image) {
						if(!/img\/sprite\/png/.test(image.url)) {
							return Promise.reject();
						}
						return Promise.resolve();
					}
				}),
				// require('postcss-at2x'),
				// проверка совместимости с браузерами
				require('doiuse')({
					browsers: [opt.browser, opt.user],
					ignore: ['rem'],
					ignoreFiles: opt.ignoreFiles
				}),
				// проверка наличия схожих цветов
				colorguard(),
				// форматированный вывод сообщений на экран
				reporter({clearReportedMessages: true})
			// чтение scss формата в css-формате
			], { syntax: scss }),
			// компиляция scss в css
			sass(),
			// замена урлов
			revReplace({manifest: gulp.src(opt.mn.dir + opt.mn.cssUrl)}),
			// подтягивание к компилированию неизменённых файлов
			remember(opt.dst.css.file),
			debug({title: 'remember'}),
			// склеивание винил-файлов
			concat(opt.dst.css.file),
			// IF-ELSE
			IF(opt.isProduction,
				// IF - сжатие и добавление хеш-суммы в имя файла
				combiner(cssnano(), rev()),
				// ELSE - добавление в css карты изменений для отладки
				sourcemaps.write()
			),
			// запись выходного файла
			gulp.dest(opt.dst.css.dir),
			// запись в манифест нового хеш-имени css-файла для вставки в html-файл
			IF(opt.isProduction,
				combiner(rev.manifest(opt.mn.cssHash), gulp.dest(opt.mn.dir))
			)
		// вывод сообщения в случае ошибки
		).on('error', notify.onError());
	};
};
