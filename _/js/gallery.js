var galleryID = '1';

mygallery = (function () {
	var o = {};
	var theGallery = theWrapper = theList = null;
	var wrapperWidth = wrapperHeight = 0;
	var controlW = 0;

	var previtemid = nextitemid = actualitemid = 0;
	var moving = true;

	o.options = {
		resizeItemToImage : false,
		proximityDelta: 0.002,
	};
	o.init = function (gID) {
		o.getScripts();
		o.getCss();
		o.createGallery(gID);
		o.resize();
		o.setControls();
	};
	o.createGallery = function(gID){
		//armar el html con las imgs
		theGallery = $('#prefix-gallery-'+gID);
		theWrapper = $(theGallery).parent();
		theControls = $('#prefix-gallery-controls-'+gID);
		theList = $('.prefix-gallery-content', $(theGallery));


	};
	o.resize = function(){
		wrapperHeight = $(theWrapper).height() - 2;
		wrapperWidth = $(theWrapper).width() - 2;
		theGallery.width(wrapperWidth);
		theGallery.height(wrapperHeight);
		//theControls.width(wrapperWidth);

		var galleryWidth = o.fiximgsWidths();

		$('.prefix-last', $(theGallery)).width($(theWrapper).width()).css('background-color', '#000');
		$(theList).width(galleryWidth + $(theWrapper).width());
		//$(theControls).width(galleryWidth + $(theWrapper).width());

		o.placeControls();
	};

	o.setControls = function(){
		
		$('.prefix-btncover a', $(theControls)).click(function(e){
			e.preventDefault();
			var itemId = parseInt( $(this).attr('id').replace('btn-', '') ) - 1;

			o.moveItems(itemId);
			actualitemid = itemId;

		});

		$(theControls).hover(
			function(){
				moving = false
			},
			function(){
				moving = true;

			});
		$(theControls).mousemove(
			function(e){
				if(moving) { return; }
				if(actualitemid == 0){ return; }
	  			var offset = $(theControls).offset();
	  			var x = e.pageX - offset.left;
				var move = false;

  				if( x < (controlW / 4)){

	  				var newleft = 0;
	  				if(x > ($(theControls).width() / 2)){
	  					newleft = -1 * (x * o.options.proximityDelta);
	  				}else{
	  					newleft = x * o.options.proximityDelta;
	  				}
	  				newleft = parseInt($(theList).css('margin-left').replace('px', ''))+newleft;
	  				console.log(parseInt($(theList).css('margin-left').replace('px', ''))+'-'+newleft);
					$(theList).css({'margin-left': newleft+'px'});
				}else if(( x > (controlW / 4) ) && ( x <= ((controlW / 4)*3) ) ){
					newleft = $($('li', $(theList)).get(actualitemid)).offset().left;
					newleft = parseInt($(theList).css('margin-left').replace('px', ''))-newleft;
	  				console.log(parseInt($(theList).css('margin-left').replace('px', ''))+'-'+newleft);
					
					console.log(newleft);
					//$(theList).css({'margin-left': newleft+'px'});
				}
					//
				/*
				else if((x < ((controlW / 2) *3) && (actualitemid > 0){
					if(x > ($(theControls).width() / 2)){
	  					newleft = -1 * (x * o.options.proximityDelta);
	  				}else{
	  					newleft = x * o.options.proximityDelta;
	  				}
	  				newleft = parseInt($(theList).css('margin-left').replace('px', ''))+newleft;
	  				
					$(theList).css({'margin-left': newleft+'px'});
				}
				*/
			}
		);
		

/*,function(e){
				if(moving == false){
					o.moveItems(actualitemid);
				}
			}
		$('.prefix-btnlinks', $(theControls)).each(function(){

			$(this).bind('proximity', {max:20}, function(e, proximity, distance){
				var neartto = parseInt( $(e.currentTarget).attr('id').replace('btn-', '') );
				if((neartto > 0) && (neartto < (totalitems -1))){
					if($(e.currentTarget).hasClass('prefix-btnprev')){
						toleft = (proximity * 30 - 10);
					}else{
						toleft = (proximity * 30 + 10);
					}
					toleft += 20;
					console.log(toleft);
					$(theList).animate({'margin-left': toleft+'px'});
				}
			});

		});
*/
	};

	o.moveItems = function(itemId){
		var mleft = wrapperWidth * itemId ;
		moving = true;
		$(theList).animate({'margin-left': (-1 * mleft)+'px'}, { duration: 340, queue: false , complete: function(){ moving = false; }});

		$('.ctrareas', $(theControls)).hide();
		if(itemId == 0){
			previtemid = 0;
			nextitemid = 1;
			var previtem = $($('.ctrareas', $(theControls)).get(itemId)).show();
			$(previtem).find('div:first').removeClass('prefix-btnnext').addClass('prefix-btnprev');
			var nextitem = $($('.ctrareas', $(theControls)).get(itemId+1)).show();
			$(nextitem).find('div:first').removeClass('prefix-btnprev').addClass('prefix-btnnext');
		}else{
			previtemid = itemId-1;
			nextitemid = itemId+1;
			var previtem = $($('.ctrareas', $(theControls)).get(itemId-1)).show();
			$(previtem).find('div:first').removeClass('prefix-btnnext').addClass('prefix-btnprev');
			var nextitem = $($('.ctrareas', $(theControls)).get(itemId+1)).show();
			$(nextitem).find('div:first').removeClass('prefix-btnprev').addClass('prefix-btnnext');

		}
	};

	o.placeControls = function(){
		newH = (wrapperHeight * 0.25);
		//
		$(theControls).height(newH).css('margin-top', (wrapperHeight - newH)+'px');
		$('.ctrareas', $(theControls)).height(newH).width($(theGallery).width() / 2);
		//$('.ctrareas:first', $(theControls)).css('margin-left', ($(theGallery).width() / 2)+'px');
		controlW = ($(theGallery).width() / 2);
		//$(theControls).css('margin-left', controlW +'px');
		//centro los controles
		var marginH = (newH-$('.prefix-btncover:first', $(theControls)).height() )/ 2;
		$('.prefix-btncover', $(theControls)).css('margin-top', marginH+'px')
		//$('.ctrareas:first', $(theControls)).css('display','none');

		$(theControls).width(controlW * ($('.ctrareas', $(theControls)).length - 1));

	};


	o.fiximgsWidths = function(){
		var gw = 0;
		$('img', $(theList)).each(function(i, ele){
			var imgNewWidth = o.getNewimgWidth($(this));
			$(this).width(imgNewWidth.width);
			$(this).height(imgNewWidth.height);

			if(imgNewWidth.height < wrapperHeight){
				//centro vertical
				$(this).css('margin-top', ((wrapperHeight - imgNewWidth.height) / 2)+'px');
			}
			if(o.options.resizeItemToImage == true){
				$(this).parent().width(imgNewWidth.width);
			}else{
				$(this).parent().width(wrapperWidth);
			}
			gw += imgNewWidth.width;
		});
		return gw;
	};

	o.getNewimgWidth = function(theImg){
		$width = wrapperWidth;
		$height = wrapperHeight;
		var $w = $(theImg).width();
		var $h = $(theImg).height();

		var $d=$width>0?$w/$width:0;
		var $d2=$height>0?$h/$height:0;
		if($d2>$d) $d=$d2;
		if($d < 1) $d=1;
		var result = {};
		result.width = $w / $d;
		result.height = $h / $d;
		return result;
		

	};
	o.getCss = function(){

	};
	o.getScripts = function(){
		return;
		var proximity = document.createElement('script');
        proximity.type = 'text/javascript';
        proximity.src = encodeURI("_/js/jquery.proximity.js");
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(proximity);
	};

	return o;
});

$(document).ready(function (){
	theG = mygallery();
	theG.init(galleryID);
});

