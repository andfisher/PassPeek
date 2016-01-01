/**
 * @desc PassPeek (for jQuery). A plugin to enable showable password fields
 *  for a better mobile UX.
 * @author Andrew Fisher
 * @copyright Copyright (c) 2015 Andrew Fisher (andfisher)
 * @version 0.0.1
 * @license The MIT License (MIT)
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

;(function($) {

    'use strict';
    
    var
    _settings = {
        strict: true,
        shown: false,
        labels: ['Show', 'Hide'],
        labelPosition: 'after'
    },
    _options = {},
    
    _shown,
    
    _init = function($element) {
        
        // If protocol is not HTTPS, strict mode will disable the plugin
        if (_options.strict && location.protocol !== 'https:') {
            return false;
        }
        
        var $proxy = $('<input type="text" value="" />'),
            $switch = $('<a href="#" class="show-password-link"></a>'),
            $holder;
        
        // Wrap the holder around the original password input
        $element.wrap('<span class="password-holder"></span>');
        
        // Get a reference to the holder
        $holder = $element.closest('.password-holder');
        
        $proxy[_shown ? 'show' : 'hide']()
        .on('keyup change blur', function(e) {
            $element.val(this.value);
        });
        
        $element[_shown ? 'hide' : 'show']();
        
        switch (_options.labelPosition) {
            case 'before':
            case 'after':
                // Inject the link before, or after
                $holder[_options.labelPosition]($switch);
                break;
            case null:
                // Do not show a link automatically
                break;
            default:
                // Treat is as a CSS selector to inject the link
                $(_options.labelPosition).append($switch);
        }
        
        $switch
            // set the correct link text
            .html(_options.labels[_shown ? 1 : 0])
            // Add the event handler
            .on('click', function(e) {
            
                e.preventDefault();

                // Invert the display of the proxy
                $proxy[_shown ? 'hide' : 'show']();
                $element[_shown ? 'show' : 'hide']();
                
                // Update the shown password value into the proxy
                if (! _shown) {
                    $proxy.val($element.val());
                }
                
                // Invert the value of shown
                _shown = !_shown;
                
                // Reset the HTML link
                $(this).html(_options.labels[_shown ? 1 : 0]);
                
                // Re-focus the password proxy element
                $proxy.focus();
            });
        
        $element.after($proxy);
        
    };
    
    $.fn.passPeek = function(opts) {
        
        // Extend the options
        $.extend(true, _options, _settings, opts);
        
        return this.each(function(i, el) {
            
            _init($(el));
            return this;
            
        });
        
    };
    
})(jQuery);