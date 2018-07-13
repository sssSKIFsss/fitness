'use strict';

var gulp = require('gulp');
// реализация оператора if
var IF = require('gulp-if');
// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// отслеживание изменения файлов
var newer = require('gulp-newer');
// сжимание картинок
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// вывод сообщений об ошибках на экран
var notify = require('gulp-notify');

// Сборка картинок:
module.exports = function (opt) {
	return function () {
		// обёртка для отслеживания ошибок
		return combiner(
			gulp.src(opt.src),
			// проверка изменений файлов в конечной папке
			newer(opt.dst),
			// сжимание картинок в релиз-версии
			IF(opt.isProduction, imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()],
				interlaced: true
			})),
			gulp.dest(opt.dst)
		// вывод сообщений об ошибках на экран
		).on('error', notify.onError());
	};
};
