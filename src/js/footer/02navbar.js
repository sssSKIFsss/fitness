var win = $(window);

win.on('load', function () {
	'use strict';

	// скрытие меню при скроллинге
	var i = 0;
	var	navbar = $('.navbar');
	var menu = $('.navbar-nav');

	win.on('scroll', function () {
		// c - currentScrollTop
		var c = win.scrollTop();
		// h - navbar height
		var h = navbar.height();

		if(navbar.hasClass('scrollNo')) {
			return;
			//navbar.removeClass('scrollNo');
		} else if (i < c && c > h + h) {
			navbar.addClass('scrollUp');
		} else if (i > c && !(c <= h)) {
			navbar.removeClass('scrollUp');
		}
		i = c;
	});

	// нажатие на гамбургер мобильного меню
	// с анимацией самого гамбургера и
	// скрытием/отображением пунктов меню
	$('.navbar-toggle').on('click', function() {
		// анимация гамбургера мобильного меню
		$('.navbar-toggle-item').toggleClass('animate');
		// активация/деактивация мобильного меню гамбургером
		menu.slideToggle(500);
		// предотвращаем скрытие открытого меню при скроллинге
		navbar.toggleClass('scrollNo');
	});

	// выбор пункта мобильного меню
	$('.navbar-nav a').on('click', function () {
		if(win.width() < 768) {
			// анимация гамбургера мобильного меню
			$('.navbar-toggle-item').toggleClass('animate');
			// деактивация мобильного меню
			menu.slideToggle(500);
		}
		// отменяем запрет на скроллинг
		navbar.toggleClass('scrollNo');
	});
});

// $.fn.hasAttr = function (name) {
// 	var attr = $(this).attr(name);
// 	return (typeof attr !== 'undefined' && attr !== false);
