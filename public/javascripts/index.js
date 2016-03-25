function setHeroHeight () {
	var hero = document.querySelectorAll('.hero')[0],
		wh = 600;

	if (window.innerHeight) {
		wh = window.innerHeight;
	}

		
	hero.style.minHeight = wh;
};

$(function() {
	setHeroHeight ();

	$('.hero-slider').slick({ 
			infinite: false, 
			arrows: false,
			dots: true
	});

	$('.cloud-slider').slick({ 
			infinite: false, 
			arrows: false,
			dots: false,
			fade: true
	});

	$('.cloud-slider').on('beforeChange', function(e, slick, currentSlide, nextSlide) {
		console.log(currentSlide);
		var slide = $('.cloud-slider__item').eq(currentSlide);
		if (slide.hasClass('cloud-slider__item--active')) {
			slide.removeClass('cloud-slider__item--active')
		}
	})



	$(".j-show-advantages").on('click', function(e) {
		e.preventDefault();
		$(this).closest('.cloud-slider__item').addClass('cloud-slider__item--active');

	})

});

var viewModel = {
	counter: 0,
	currentLimit: 56,
	currentSpeed: 60,
	interval: {},
	images: [
		'https://coderussia.blob.core.windows.net/cloud1/1.png', 
		'https://coderussia.blob.core.windows.net/cloud1/2.png', 
		'https://coderussia.blob.core.windows.net/cloud1/3.png', 
		'https://coderussia.blob.core.windows.net/cloud1/4.png'
	],
	loadImg: function(src, cb) {
		var img = new Image();
		img.src = src;
		img.onload = function() {
			cb();
		};
	},
	checkLitmit: function() {
		return viewModel.counter == viewModel.currentLimit ? 1 : -1
	},
	initClouds: function() {
		var diff = 1;
		var cont = $('body');
		viewModel.interval = setInterval(function() {

			if (viewModel.counter == viewModel.currentLimit) {
				diff = -1;
			} else if (viewModel.counter == 0) {
				diff = 1;
			}

			viewModel.counter += diff;
			console.log(viewModel.counter)

		}, viewModel.currentSpeed)
	}
}



/*$(function() {
	viewModel.loadImg(viewModel.images[0], function() {
		viewModel.initClouds();
		viewModel.loadImg(viewModel.images[1], function() {
			viewModel.currentLimit = 120;
			viewModel.loadImg(viewModel.images[2], function() {
				viewModel.currentLimit = 150;
				viewModel.loadImg(viewModel.images[3], function() {
					viewModel.currentLimit = 176;
				})
			})
		})
	});

});*/


