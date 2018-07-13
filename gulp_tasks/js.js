'use strict';

// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// собсвтенно сам сборщик - gulp
var gulp = require('gulp');
// реализация оператора if
var IF = require('gulp-if');
// фильтрация неизменённых файлов
var cached = require('gulp-cached');
// сохранение инфы о компилировании
var sourcemaps = require('gulp-sourcemaps');
// объединение файлов в один
var rigger = require('gulp-rigger');
// сжатие файлов
var uglify = require('gulp-uglify');
// подтягивание к компилированию неизменённых файлов
var remember = require('gulp-remember');
// вывод сообщений на экран
var concat = require('gulp-concat');
// замена урлов
var revReplace = require('gulp-rev-replace');
// переименование css-файла в хеш-сумму
var rev = require('gulp-rev');
// вывод сообщений на экран
var notify = require('gulp-notify');

// Сборка js:
module.exports = function (opt) {
	return function () {
		// обёртка для отслеживания ошибок
		return combiner(
			// чтение исходных файлов
			gulp.src(opt.src),
			// отслеживание изменений при компиляции файла
			IF(!opt.isProduction, sourcemaps.init()),
			// фильтрация неизменённых файлов
			// в скобках не путь, а просто название кеша
			cached(opt.dst.file),
			// вставка в текущий файл других файлов
			rigger(),
			// замена урлов
			revReplace({ manifest: gulp.src(opt.mn.dir + opt.mn.url)}),
			// подтягивание к компилированию неизменённых файлов
			// в скобках не путь, а просто название кеша
			remember(opt.dst.file),
			// склеивание винил-файлов
			concat(opt.dst.file),
			// IF-ELSE
			IF(opt.isProduction,
				// IF - сжатие и добавление хеш-суммы в имя файла
				combiner(uglify(), rev()),
				// ELSE - добавление в css карты изменений для отладки
				sourcemaps.write()
			),
			// запись выходного файла
			gulp.dest(opt.dst.dir),
			// запись в манифест нового хеш-имени js-файла для вставки затем в html-файл
			IF(opt.isProduction,
				combiner(rev.manifest(opt.mn.hash), gulp.dest(opt.mn.dir))
			)
		// вывод сообщения в случае ошибки
		).on('error', notify.onError());
	};
};
