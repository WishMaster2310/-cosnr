$(function() {

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