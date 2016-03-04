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
});