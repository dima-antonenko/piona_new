(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
/* Notify.js - http://notifyjs.com/ Copyright (c) 2015 MIT */

(function (factory) {
	// UMD start
	// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	//IE8 indexOf polyfill
	var indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	};

	var pluginName = "notify";
	var pluginClassName = pluginName + "js";
	var blankFieldName = pluginName + "!blank";

	var positions = {
		t: "top",
		m: "middle",
		b: "bottom",
		l: "left",
		c: "center",
		r: "right"
	};
	var hAligns = ["l", "c", "r"];
	var vAligns = ["t", "m", "b"];
	var mainPositions = ["t", "b", "l", "r"];
	var opposites = {
		t: "b",
		m: null,
		b: "t",
		l: "r",
		c: null,
		r: "l"
	};

	var parsePosition = function(str) {
		var pos;
		pos = [];
		$.each(str.split(/\W+/), function(i, word) {
			var w;
			w = word.toLowerCase().charAt(0);
			if (positions[w]) {
				return pos.push(w);
			}
		});
		return pos;
	};

	var styles = {};

	var coreStyle = {
		name: "core",
		html: "<div class=\"" + pluginClassName + "-wrapper\">\n	<div class=\"" + pluginClassName + "-arrow\"></div>\n	<div class=\"" + pluginClassName + "-container\"></div>\n</div>",
		css: "." + pluginClassName + "-corner {\n	position: fixed;\n	margin: 5px;\n	z-index: 1050;\n}\n\n." + pluginClassName + "-corner ." + pluginClassName + "-wrapper,\n." + pluginClassName + "-corner ." + pluginClassName + "-container {\n	position: relative;\n	display: block;\n	height: inherit;\n	width: inherit;\n	margin: 3px;\n}\n\n." + pluginClassName + "-wrapper {\n	z-index: 1;\n	position: absolute;\n	display: inline-block;\n	height: 0;\n	width: 0;\n}\n\n." + pluginClassName + "-container {\n	display: none;\n	z-index: 1;\n	position: absolute;\n}\n\n." + pluginClassName + "-hidable {\n	cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n	position: relative;\n}\n\n." + pluginClassName + "-arrow {\n	position: absolute;\n	z-index: 2;\n	width: 0;\n	height: 0;\n}"
	};

	var stylePrefixes = {
		"border-radius": ["-webkit-", "-moz-"]
	};

	var getStyle = function(name) {
		return styles[name];
	};

	var removeStyle = function(name) {
		if (!name) {
			throw "Missing Style name";
		}
		if (styles[name]) {
			delete styles[name];
		}
	};

	var addStyle = function(name, def) {
		if (!name) {
			throw "Missing Style name";
		}
		if (!def) {
			throw "Missing Style definition";
		}
		if (!def.html) {
			throw "Missing Style HTML";
		}
		//remove existing style
		var existing = styles[name];
		if (existing && existing.cssElem) {
			if (window.console) {
				console.warn(pluginName + ": overwriting style '" + name + "'");
			}
			styles[name].cssElem.remove();
		}
		def.name = name;
		styles[name] = def;
		var cssText = "";
		if (def.classes) {
			$.each(def.classes, function(className, props) {
				cssText += "." + pluginClassName + "-" + def.name + "-" + className + " {\n";
				$.each(props, function(name, val) {
					if (stylePrefixes[name]) {
						$.each(stylePrefixes[name], function(i, prefix) {
							return cssText += "	" + prefix + name + ": " + val + ";\n";
						});
					}
					return cssText += "	" + name + ": " + val + ";\n";
				});
				return cssText += "}\n";
			});
		}
		if (def.css) {
			cssText += "/* styles for " + def.name + " */\n" + def.css;
		}
		if (cssText) {
			def.cssElem = insertCSS(cssText);
			def.cssElem.attr("id", "notify-" + def.name);
		}
		var fields = {};
		var elem = $(def.html);
		findFields("html", elem, fields);
		findFields("text", elem, fields);
		def.fields = fields;
	};

	var insertCSS = function(cssText) {
		var e, elem, error;
		elem = createElem("style");
		elem.attr("type", 'text/css');
		$("head").append(elem);
		try {
			elem.html(cssText);
		} catch (_) {
			elem[0].styleSheet.cssText = cssText;
		}
		return elem;
	};

	var findFields = function(type, elem, fields) {
		var attr;
		if (type !== "html") {
			type = "text";
		}
		attr = "data-notify-" + type;
		return find(elem, "[" + attr + "]").each(function() {
			var name;
			name = $(this).attr(attr);
			if (!name) {
				name = blankFieldName;
			}
			fields[name] = type;
		});
	};

	var find = function(elem, selector) {
		if (elem.is(selector)) {
			return elem;
		} else {
			return elem.find(selector);
		}
	};

	var pluginOptions = {
		clickToHide: true,
		autoHide: true,
		autoHideDelay: 5000,
		arrowShow: true,
		arrowSize: 5,
		breakNewLines: true,
		elementPosition: "bottom",
		globalPosition: "top right",
		style: "bootstrap",
		className: "error",
		showAnimation: "slideDown",
		showDuration: 400,
		hideAnimation: "slideUp",
		hideDuration: 200,
		gap: 5
	};

	var inherit = function(a, b) {
		var F;
		F = function() {};
		F.prototype = a;
		return $.extend(true, new F(), b);
	};

	var defaults = function(opts) {
		return $.extend(pluginOptions, opts);
	};

	var createElem = function(tag) {
		return $("<" + tag + "></" + tag + ">");
	};

	var globalAnchors = {};

	var getAnchorElement = function(element) {
		var radios;
		if (element.is('[type=radio]')) {
			radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
				return $(e).attr("name") === element.attr("name");
			});
			element = radios.first();
		}
		return element;
	};

	var incr = function(obj, pos, val) {
		var opp, temp;
		if (typeof val === "string") {
			val = parseInt(val, 10);
		} else if (typeof val !== "number") {
			return;
		}
		if (isNaN(val)) {
			return;
		}
		opp = positions[opposites[pos.charAt(0)]];
		temp = pos;
		if (obj[opp] !== undefined) {
			pos = positions[opp.charAt(0)];
			val = -val;
		}
		if (obj[pos] === undefined) {
			obj[pos] = val;
		} else {
			obj[pos] += val;
		}
		return null;
	};

	var realign = function(alignment, inner, outer) {
		if (alignment === "l" || alignment === "t") {
			return 0;
		} else if (alignment === "c" || alignment === "m") {
			return outer / 2 - inner / 2;
		} else if (alignment === "r" || alignment === "b") {
			return outer - inner;
		}
		throw "Invalid alignment";
	};

	var encode = function(text) {
		encode.e = encode.e || createElem("div");
		return encode.e.text(text).html();
	};

	function Notification(elem, data, options) {
		if (typeof options === "string") {
			options = {
				className: options
			};
		}
		this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
		this.loadHTML();
		this.wrapper = $(coreStyle.html);
		if (this.options.clickToHide) {
			this.wrapper.addClass(pluginClassName + "-hidable");
		}
		this.wrapper.data(pluginClassName, this);
		this.arrow = this.wrapper.find("." + pluginClassName + "-arrow");
		this.container = this.wrapper.find("." + pluginClassName + "-container");
		this.container.append(this.userContainer);
		if (elem && elem.length) {
			this.elementType = elem.attr("type");
			this.originalElement = elem;
			this.elem = getAnchorElement(elem);
			this.elem.data(pluginClassName, this);
			this.elem.before(this.wrapper);
		}
		this.container.hide();
		this.run(data);
	}

	Notification.prototype.loadHTML = function() {
		var style;
		style = this.getStyle();
		this.userContainer = $(style.html);
		this.userFields = style.fields;
	};

	Notification.prototype.show = function(show, userCallback) {
		var args, callback, elems, fn, hidden;
		callback = (function(_this) {
			return function() {
				if (!show && !_this.elem) {
					_this.destroy();
				}
				if (userCallback) {
					return userCallback();
				}
			};
		})(this);
		hidden = this.container.parent().parents(':hidden').length > 0;
		elems = this.container.add(this.arrow);
		args = [];
		if (hidden && show) {
			fn = "show";
		} else if (hidden && !show) {
			fn = "hide";
		} else if (!hidden && show) {
			fn = this.options.showAnimation;
			args.push(this.options.showDuration);
		} else if (!hidden && !show) {
			fn = this.options.hideAnimation;
			args.push(this.options.hideDuration);
		} else {
			return callback();
		}
		args.push(callback);
		return elems[fn].apply(elems, args);
	};

	Notification.prototype.setGlobalPosition = function() {
		var p = this.getPosition();
		var pMain = p[0];
		var pAlign = p[1];
		var main = positions[pMain];
		var align = positions[pAlign];
		var key = pMain + "|" + pAlign;
		var anchor = globalAnchors[key];
		if (!anchor || !document.body.contains(anchor[0])) {
			anchor = globalAnchors[key] = createElem("div");
			var css = {};
			css[main] = 0;
			if (align === "middle") {
				css.top = '45%';
			} else if (align === "center") {
				css.left = '45%';
			} else {
				css[align] = 0;
			}
			anchor.css(css).addClass(pluginClassName + "-corner");
			$("body").append(anchor);
		}
		return anchor.prepend(this.wrapper);
	};

	Notification.prototype.setElementPosition = function() {
		var arrowColor, arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, gap, j, k, len, len1, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, pos, posFull, position, ref, wrapPos;
		position = this.getPosition();
		pMain = position[0];
		pAlign = position[1];
		pArrow = position[2];
		elemPos = this.elem.position();
		elemH = this.elem.outerHeight();
		elemW = this.elem.outerWidth();
		elemIH = this.elem.innerHeight();
		elemIW = this.elem.innerWidth();
		wrapPos = this.wrapper.position();
		contH = this.container.height();
		contW = this.container.width();
		mainFull = positions[pMain];
		opp = opposites[pMain];
		oppFull = positions[opp];
		css = {};
		css[oppFull] = pMain === "b" ? elemH : pMain === "r" ? elemW : 0;
		incr(css, "top", elemPos.top - wrapPos.top);
		incr(css, "left", elemPos.left - wrapPos.left);
		ref = ["top", "left"];
		for (j = 0, len = ref.length; j < len; j++) {
			pos = ref[j];
			margin = parseInt(this.elem.css("margin-" + pos), 10);
			if (margin) {
				incr(css, pos, margin);
			}
		}
		gap = Math.max(0, this.options.gap - (this.options.arrowShow ? arrowSize : 0));
		incr(css, oppFull, gap);
		if (!this.options.arrowShow) {
			this.arrow.hide();
		} else {
			arrowSize = this.options.arrowSize;
			arrowCss = $.extend({}, css);
			arrowColor = this.userContainer.css("border-color") || this.userContainer.css("border-top-color") || this.userContainer.css("background-color") || "white";
			for (k = 0, len1 = mainPositions.length; k < len1; k++) {
				pos = mainPositions[k];
				posFull = positions[pos];
				if (pos === opp) {
					continue;
				}
				color = posFull === mainFull ? arrowColor : "transparent";
				arrowCss["border-" + posFull] = arrowSize + "px solid " + color;
			}
			incr(css, positions[opp], arrowSize);
			if (indexOf.call(mainPositions, pAlign) >= 0) {
				incr(arrowCss, positions[pAlign], arrowSize * 2);
			}
		}
		if (indexOf.call(vAligns, pMain) >= 0) {
			incr(css, "left", realign(pAlign, contW, elemW));
			if (arrowCss) {
				incr(arrowCss, "left", realign(pAlign, arrowSize, elemIW));
			}
		} else if (indexOf.call(hAligns, pMain) >= 0) {
			incr(css, "top", realign(pAlign, contH, elemH));
			if (arrowCss) {
				incr(arrowCss, "top", realign(pAlign, arrowSize, elemIH));
			}
		}
		if (this.container.is(":visible")) {
			css.display = "block";
		}
		this.container.removeAttr("style").css(css);
		if (arrowCss) {
			return this.arrow.removeAttr("style").css(arrowCss);
		}
	};

	Notification.prototype.getPosition = function() {
		var pos, ref, ref1, ref2, ref3, ref4, ref5, text;
		text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
		pos = parsePosition(text);
		if (pos.length === 0) {
			pos[0] = "b";
		}
		if (ref = pos[0], indexOf.call(mainPositions, ref) < 0) {
			throw "Must be one of [" + mainPositions + "]";
		}
		if (pos.length === 1 || ((ref1 = pos[0], indexOf.call(vAligns, ref1) >= 0) && (ref2 = pos[1], indexOf.call(hAligns, ref2) < 0)) || ((ref3 = pos[0], indexOf.call(hAligns, ref3) >= 0) && (ref4 = pos[1], indexOf.call(vAligns, ref4) < 0))) {
			pos[1] = (ref5 = pos[0], indexOf.call(hAligns, ref5) >= 0) ? "m" : "l";
		}
		if (pos.length === 2) {
			pos[2] = pos[1];
		}
		return pos;
	};

	Notification.prototype.getStyle = function(name) {
		var style;
		if (!name) {
			name = this.options.style;
		}
		if (!name) {
			name = "default";
		}
		style = styles[name];
		if (!style) {
			throw "Missing style: " + name;
		}
		return style;
	};

	Notification.prototype.updateClasses = function() {
		var classes, style;
		classes = ["base"];
		if ($.isArray(this.options.className)) {
			classes = classes.concat(this.options.className);
		} else if (this.options.className) {
			classes.push(this.options.className);
		}
		style = this.getStyle();
		classes = $.map(classes, function(n) {
			return pluginClassName + "-" + style.name + "-" + n;
		}).join(" ");
		return this.userContainer.attr("class", classes);
	};

	Notification.prototype.run = function(data, options) {
		var d, datas, name, type, value;
		if ($.isPlainObject(options)) {
			$.extend(this.options, options);
		} else if ($.type(options) === "string") {
			this.options.className = options;
		}
		if (this.container && !data) {
			this.show(false);
			return;
		} else if (!this.container && !data) {
			return;
		}
		datas = {};
		if ($.isPlainObject(data)) {
			datas = data;
		} else {
			datas[blankFieldName] = data;
		}
		for (name in datas) {
			d = datas[name];
			type = this.userFields[name];
			if (!type) {
				continue;
			}
			if (type === "text") {
				d = encode(d);
				if (this.options.breakNewLines) {
					d = d.replace(/\n/g, '<br/>');
				}
			}
			value = name === blankFieldName ? '' : '=' + name;
			find(this.userContainer, "[data-notify-" + type + value + "]").html(d);
		}
		this.updateClasses();
		if (this.elem) {
			this.setElementPosition();
		} else {
			this.setGlobalPosition();
		}
		this.show(true);
		if (this.options.autoHide) {
			clearTimeout(this.autohideTimer);
			this.autohideTimer = setTimeout(this.show.bind(this, false), this.options.autoHideDelay);
		}
	};

	Notification.prototype.destroy = function() {
		this.wrapper.data(pluginClassName, null);
		this.wrapper.remove();
	};

	$[pluginName] = function(elem, data, options) {
		if ((elem && elem.nodeName) || elem.jquery) {
			$(elem)[pluginName](data, options);
		} else {
			options = data;
			data = elem;
			new Notification(null, data, options);
		}
		return elem;
	};

	$.fn[pluginName] = function(data, options) {
		$(this).each(function() {
			var prev = getAnchorElement($(this)).data(pluginClassName);
			if (prev) {
				prev.destroy();
			}
			var curr = new Notification($(this), data, options);
		});
		return this;
	};

	$.extend($[pluginName], {
		defaults: defaults,
		addStyle: addStyle,
		removeStyle: removeStyle,
		pluginOptions: pluginOptions,
		getStyle: getStyle,
		insertCSS: insertCSS
	});

	//always include the default bootstrap style
	addStyle("bootstrap", {
		html: "<div>\n<span data-notify-text></span>\n</div>",
		classes: {
			base: {
				"font-weight": "bold",
				"padding": "8px 15px 8px 14px",
				"text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
				"background-color": "#fcf8e3",
				"border": "1px solid #fbeed5",
				"border-radius": "4px",
				"white-space": "nowrap",
				"padding-left": "25px",
				"background-repeat": "no-repeat",
				"background-position": "3px 7px"
			},
			error: {
				"color": "#B94A48",
				"background-color": "#F2DEDE",
				"border-color": "#EED3D7",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
			},
			success: {
				"color": "#468847",
				"background-color": "#DFF0D8",
				"border-color": "#D6E9C6",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
			},
			info: {
				"color": "#3A87AD",
				"background-color": "#D9EDF7",
				"border-color": "#BCE8F1",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
			},
			warn: {
				"color": "#C09853",
				"background-color": "#FCF8E3",
				"border-color": "#FBEED5",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
			}
		}
	});

	$(function() {
		insertCSS(coreStyle.css).attr("id", "core-notify");
		$(document).on("click", "." + pluginClassName + "-hidable", function(e) {
			$(this).trigger("notify-hide");
		});
		$(document).on("notify-hide", "." + pluginClassName + "-wrapper", function(e) {
			var elem = $(this).data(pluginClassName);
			if(elem) {
				elem.show(false);
			}
		});
	});

}));
// require jquery





crud_ui = {
  success_update: function() {
    $.notify("Запрос отправлен", "success");
  },

  failed_update: function() {
    $.notify("Произошла ошибка", "error");
  }
};

product_ui = {
  success_create_back_call: function() {
    $.notify("Запрос отправлен", "success");
    $('#back_call_phone').val('');
  },

  success_create_product_question: function() {
    $.notify("Вопрос отправлен", "success");
    $('#product_question_name').val('');
    $('#product_question_phone').val('');
    $('#product_question_text').val('');
  },

  success_create_form_request: function() {
    $.notify("Заявка отправлена", "success");
    $('#form_request_name').val('');
    $('#form_request_email').val('');
    $('#form_request_phone').val('');
    $('#form_request_text').val('');
  },

  success_create_quick_order: function() {
    $.notify("Заказ отправлен, спасибо", "success");
    $('#customer_phone').val('');
  },

  success_create_order: function() {
    $.notify("Заказ отправлен, спасибо", "success");
    setTimeout(function() {
      window.location.href = "/";
    }, 2000);
  }

  
};
