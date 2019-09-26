'use strict';

var gulp = require('gulp');
// реализация оператора if
var IF = require('gulp-if');
// отслеживание ошибок + возможность параллельного вызова потоков
var combiner = require('stream-combiner2').obj;
// отслеживание изменения файлов
var newer = require('gulp-newer');
// сжимание картинок
var imageMin = require('gulp-imagemin');
var pngCompress = require('imagemin-pngquant');
var jpegCompress = require('imagemin-jpeg-recompress');

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
			// сжимание картинок
			imageMin([
				imageMin.gifsicle({interlaced: true}),
				jpegCompress({
					progressive: true,
					max: 90,
					min: 80
				}),
				pngCompress(),
				imageMin.svgo({plugins: [{removeViewBox: false}]})
			]),
			gulp.dest(opt.dst)
		// вывод сообщений об ошибках на экран
		).on('error', notify.onError());
	};
};

