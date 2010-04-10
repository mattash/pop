//
//  pop! for jQuery
//  v0.2 requires jQuery v1.2 or later
//  
//  Licensed under the MIT:
//  http://www.opensource.org/licenses/mit-license.php
//  
//  Copyright 2007,2008 SEAOFCLOUDS [http://seaofclouds.com]
//

(function($) {
	$.fn.pop = function(options){
		var defaults, opts, el, totalpops
		defaults = {
			toggle_text: "",
			toggle_class: ".pop_toggle",
			wrapper_class: ".pop_wrapper",
			hang_left: false,
			hang_under: false,
			initial_zindex: 1000,
			selector: this.selector,
			checkActive: function() {
				$(this.selector).each( function () {
					check = $(this);
					if(check.data('status')) {
						if (check.data('status').active != true) {
							check.removeClass('active');
						}
					}
				});
				return false;
			}
		};
		opts = $.extend(defaults,options);
		totalpops = this.size() + opts.initial_zindex;
		
		//initialize menus
		return this.each(function(i) {
			var el, orig_classes, popzindex, wrapper, toggler, outside_screen, toggle_text
			el = $(this);
			orig_classes = el.attr("class");
			el.addClass("pop_menu").removeClass(opts.selector.substring(1));
			el.wrap("<div class='"+orig_classes+"'></div>"); // wrap original div
			wrapper = el.parent().addClass(opts.wrapper_class.substring(1)); // set wrapper and add wrapper class
			wrapper.data('status'); // initialize status setting
			
			// if there is no toggler text and the element has a title attribute, use that.
			if(opts.toggle_text == "" && el.attr('title')) {
				toggle_text = el.attr('title');
				el.removeAttr('title');
			} else {
				toggle_text = opts.toggle_text;
			}
						
			toggler = $("<div class='"+opts.toggle_class.substring(1)+"'> \
				<span>"+toggle_text+"</span> \
				</div>").insertBefore(el); // add toggler div
			
			// if menu should go under toggle add class
			if(opts.hang_under) { el.addClass("pop_under"); }
				
			// if menu should hang toward the left add class
			outside_screen = (wrapper.offset().left + parseInt(el.css('width'))) > parseInt($(window).width());
			if(outside_screen || opts.hang_left) { el.addClass("pop_left"); }
			
			// assign reverse z-indexes to each pop		
			popzindex = totalpops - i;
			wrapper.css({ zIndex: popzindex });
			
			//set menu as active/inactive
			wrapper.mouseover(function() { $(this).data('status',{active:true}); });
			wrapper.mouseout(function() { $(this).data('status',{active:false}); });

			// toggle that pop
			toggler.click(function(){
				el = $(this);
				el.parent(opts.selector).toggleClass("active").data('active',true);
			});

			// When clicking the body the menu is closed
			$(document.body).click( $.proxy( defaults, "checkActive") );
			
		});	
  }

})(jQuery);