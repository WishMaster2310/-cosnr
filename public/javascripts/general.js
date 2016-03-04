$(function() {
	var loadSectionBgs = function(img) {
		var parent = $(img).parent();
		var newImg = new Image;
		newImg.src = $(img).attr("data-src");
		newImg.onload = function() {
			$(parent).css({
				backgroundImage: "url("+ $(this).attr('src') +")"
			});
			$(parent).fadeIn();
		}
	};


	$('.j-lazybg').each(function(indx, elem) {
			loadSectionBgs(elem);
	});

	$('.j-listtoggle').on('click', function(e) {
		e.preventDefault();
		var parent = $(this).closest('.wrapped-section');
		var popover = $(parent).find('.wrapped-section__popover');
		console.log(popover)

		$(popover).toggleClass('wrapped-section__popover--active');
	});

	$('.wrapped-section__times').on('click', function(e) {
		e.preventDefault();
		var popover = $(this).closest('.wrapped-section__popover');

		$(popover).removeClass('wrapped-section__popover--active');
	});
});