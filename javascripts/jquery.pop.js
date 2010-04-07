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
		var defaults, opts, el, orig_classes, totalpops, popzindex, activePop, toggler
		defaults = {
			toggle_text: "",
			toggle_class: ".pop_toggle",
			wrapper_class: ".pop_wrapper",
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
			el = $(this);
			orig_classes = el.attr("class");
			el.addClass("pop_menu").removeClass(opts.selector.substring(1	));
			el.wrap("<div class='"+orig_classes+"'></div>"); // wrap original div
			wrapper = el.parent().addClass(opts.wrapper_class.substring(1)); // set wrapper and add wrapper class
			wrapper.data('status'); // initialize status setting
			toggler = $("<div class='"+opts.toggle_class.substring(1)+"'> \
				<span>"+opts.toggle_text+"</span> \
				</div>").insertBefore(el); // add toggler div
			
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