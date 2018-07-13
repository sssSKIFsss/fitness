'use strict';

// собсвтенно сам сборщик - gulp
var gulp = require('gulp');
// реализация оператора if
var IF = require('gulp-if');
// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// фильтрация неизменённых файлов
var cached = require('gulp-cached');
// отслеживание изменения файлов
var newer = require('gulp-newer');
// сохранение инфы о компилировании
var sourcemaps = require('gulp-sourcemaps');
// объединение файлов .html в один
var rigger = require('gulp-rigger');
// замена урлов
var revReplace = require('gulp-rev-replace');
// вывод сообщений об ошибках на экран
var notify = require('gulp-notify');

// Сборка html:
module.exports = function (opt) {
	return function () {
		// обёртка для отслеживания ошибок
		return combiner(
			// чтение исходных файлов
			gulp.src(opt.src),
			// проверка изменений файлов в конечной папке
			// полезна при первой компиляции
			newer(opt.dst),
			// фильтрация неизменённых файлов
			cached('html'),
			// запус процесса отслеживания изменений
			IF(!opt.isProduction, sourcemaps.init()),
			// объединение файлов .html в один
			rigger(),
			// замена путей и урлов
			revReplace({ manifest: gulp.src(opt.htmlUrl) }),
			// IF-ELSE
			IF((opt.isProduction),
				// IF - замена в html-тексте имён файлов (css,js) на их хеш-имена
				combiner(
					revReplace({
						manifest: gulp.src(opt.cssHash, {allowEmpty: true})
					}),
					revReplace({
						manifest: gulp.src(opt.jsHeaderHash, {allowEmpty: true})
					}),
					revReplace({
						manifest: gulp.src(opt.jsFooterHash, {allowEmpty: true})
					})
				),
				// ELSE - добавление в карты изменений для отладки
				sourcemaps.write()
			),
			// запись в конечный файл
			gulp.dest(opt.dst)
		// вывод сообщений на экран
		).on('error', notify.onError());
	};
};
