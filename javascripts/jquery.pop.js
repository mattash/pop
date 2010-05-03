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
		var defaults, opts
		defaults = {
			toggle_text: "",
			toggle_class: ".pop_toggle",
			wrapper_class: ".pop_wrapper",
			menu_class: ".pop_menu",
			hang_left: false,
			hang_under: false,
			initial_zindex: 1000,
			selector: this.selector,
		};
		
		//Merge options
		opts = $.extend(defaults,options);
		
		//Setup the info object for storing wrappers and totals
		info = {
			total: function() { 
				this.size() + opts.initial_zindex 
			},
			wrappers: Array(),
			addWrapper: function(wrapper) {
				num = info.wrappers.length;
				if(num=1) {
					info.wrappers[0] = wrapper;
				} else {
					info.wrappers[num+1] = wrapper;
				}
			},
			checkActive: function() {
				$(info.wrappers).trigger("checkActive");
			}
		};
		
		//initialize pops
		this.each( function(i) {
			var el, orig_classes, popzindex, wrapper, toggler, outside_screen, toggle_text
			el = $(this);
			orig_classes = el.attr("class");
			el.removeClass(function(){ $(this).attr('class')}).addClass("pop_menu");
			el.wrap("<div class='"+orig_classes+"'></div>"); // wrap original div
			wrapper = el.parent().addClass(opts.wrapper_class.substring(1)); // set wrapper and add wrapper class
			wrapper.data('status'); // initialize status setting
		
			// if there is no toggler text and the element has a title attribute, use that.
			if(opts.toggle_text == "" && el.attr('title')) {
				toggle_text = el.attr('title')
				el.removeAttr('title');
			} else {
				toggle_text = opts.toggle_text;
			}
					
			toggler = $("<div class='"+opts.toggle_class.substring(1)+"'> \
				<span>"+toggle_text+"</span> \
				</div>").insertBefore(el); // add toggler div
			
			//if tip Title, move to toggler. For compatability with ToolTips.
			if(el.attr("tipTitle")) {
				toggler.attr("tipTitle", el.attr("tipTitle"));
				el.removeAttr("tipTitle");
			}
		
			// if menu should go under toggle add class
			if(opts.hang_under) { el.addClass("pop_under"); }
			
			// if menu should hang toward the left add class
			outside_screen = (wrapper.offset().left + parseInt(el.css('width'))) > parseInt($(window).width());
			if(outside_screen || opts.hang_left) { el.addClass("pop_left"); }
		
			// assign reverse z-indexes to each pop		
			popzindex = info.total - i;
			wrapper.css({ zIndex: popzindex });
		
			//set menu as active/inactive
			wrapper.mouseover(function() { $(this).data('status',{active:true}); });
			wrapper.mouseout(function() { $(this).data('status',{active:false}); });
			
			//Add wrapper to array of wrappers
			info.addWrapper(wrapper);
		});
		
		//apply check active event to wrappers
		$(info.wrappers).bind("checkActive", function() {
			check = $(this);
			if(check.data('status')) {
				if (check.data('status').active != true) {
					check.removeClass('active');
				}
			}
		});

		//trigger check active events when the body is clicked
		$(document.body).click( $.proxy(info,"checkActive"));

		//bind toggler to toggle_class
		return $(opts.toggle_class).bind("click", function() {
			el = $(this);
			el.parent(opts.selector).toggleClass("active").data('active',true).css("height",el.outerHeight()+"px");
			left = el.next(".pop_left");
			if (left.size()>0) {
				p = el.outerWidth();
				l = left.outerWidth();
				left.css("left",-l+p+"px")				
			}
		});
  }

})(jQuery);