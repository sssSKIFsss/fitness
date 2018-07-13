'use strict';

// удаление файлов и папок
var del = require('del');

// Очистка папки 'options.src
module.exports = function (opt) {
	return function () {
		return del([
			opt.src,
			opt.cssHash,
			opt.jsHeaderHash,
			opt.jsFooterHash
		]);
	};
};
