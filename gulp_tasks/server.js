'use strict';

// создание сервера и обмен данными с браузером
var browserSync = require('browser-sync').create();

// переменная с настройками нашего сервера:
var config = {
	server: {
		baseDir: "./build"
	},
	//tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "SKIF"
};

// Веб сервер
module.exports = function (opt) {
	return function () {
		browserSync.init(config);
		browserSync.watch(opt.src).on('change', browserSync.reload);
	};
};
