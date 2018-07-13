'use strict';

var gulp = require('gulp');
// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// отслеживание изменения файлов
var newer = require('gulp-newer');
// переименование пути к файлу
var rename = require('gulp-rename');
// вывод сообщений об ошибках на экран
var notify = require('gulp-notify');

// копируем файлы:
module.exports = function (opt) {
	return function () {
		// оборачиваем в combiner для отслеживания ошибок
		return combiner(
			// чтение файлов в поток
			gulp.src(opt.src),
			// оставляем в path.relative только имя файла
			rename(function(path) {
				path.dirname = '';
			}),
			// проверяем конечную папку на изменения файлов
			newer(opt.dst),
			// запись из потока в файл
			gulp.dest(opt.dst)
		// вывод сообщений об ошибках на экран
		).on('error', notify.onError());
	};
};
