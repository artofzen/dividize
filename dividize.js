(function ($) {
    "use strict";

    $.fn.dividize = function (options) {

        var settings = $.extend({
            customHeaderTarget  : 'th',     //custom header row target (if not normal table)
            removeHeaders       : false,    //remove/leave headers div
            addLabelHeaders     : false,    //add headers to each cell
            hideLabels          : true,     //hide the labelHeader by default
            preserveEvents      : false,    //save events cell content and restore after conversion
            preserveDim         : false,    //try to keep cell widths & heights
            classes             : '',       //add any extra classes to converted div
            enableAltRows       : false     //enable alternating rows
        }, options);

        var eventManager = { //Manage the events we want to save and restore

            container : {
                eventContainer : {},
            },
            save : function($elem) {
                var self = this;

                $elem.find('*').each(function (index, element) {
                    var events = $(element).data('events'); //get source events
                    var elemIndex = 'index-' + index;

                    if (typeof events == 'undefined') {  //make sure there are events
                        return true;
                    }

                    $.each(events, function (eventType, eventArray) { //iterate through all event types
                        $.each(eventArray, function (iindex, event) { //iterate through every bound handler
                            //take event namespaces into account
                            var eventToBind = event.namespace.length > 0 ? (event.type + '.' + event.namespace) : (event.type);

                            //create new index
                            if (typeof self.container.eventContainer[elemIndex] == 'undefined') {
                                self.container.eventContainer[elemIndex] = [];
                            }

                            //push events to container
                            self.container.eventContainer[elemIndex].push({
                                eventToBind     : eventToBind,
                                eventData       : event.data,
                                eventHandler    : event.handler,
                            });
                        }); //end each(eventArray, function (iindex, event)
                    }); //end each(events, function (eventType, eventArray)
                    $(element).attr('data-event-index', elemIndex); //add marker to element so we can map back correct event
                }); //end .each(function (index, element)
            },
            restore : function($elem) {
                var self = this;

                $elem.find('*').each(function (index, element) {
                    var $element = $(element);
                    var indexID = $element.attr('data-event-index');

                    if (typeof indexID != 'undefined') {
                        var events = self.container.eventContainer[indexID];

                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];

                            $element.unbind(event.eventToBind); //unbind any similar events
                            $element.bind(event.eventToBind, event.eventData, event.eventHandler);
                        }
                    } //end if
                }); //end each
            }
        };

        if (settings.preserveEvents) { //save events to reattach later
            eventManager.save(this);
        } //end if

        var globalIndex = 0; //global index to make each element unique

        this.replaceWith(function () {
            var $self = $(this);

            var $th = $self.find(settings.customHeaderTarget); //get header target
            var th = $th.map(function () {
                return $(this).html();
            }).get(); //get values

            if (settings.removeHeaders) {
                $th.closest('tr').remove(); //remove the headers
            }

            var $table = $('<div>').addClass('dvdz-box').addClass(settings.classes); //our table replacement

            var rowCount = $self.find('tr').length; //add/first last row tags
            $('tr', $self).each(function (i) { //iterate table rows

                var $row = $('<div>') //add our classes and append row to table
                    .addClass('dvdz-' + globalIndex++)
                    .addClass('dvdz-row')
                    .addClass('dvdz-row-' + i)
                    .appendTo($table);

                if (settings.enableAltRows) { //add alternating row classes
                    $row.addClass((i % 2) === 0 ? 'even' : 'odd');
                }

                if (i === 0) { //mark first and last row
                    $row.addClass('first-row');
                } else if (i == (rowCount - 1)) {
                    $row.addClass('last-row');
                }

                var cellCount = $(this).find('td, ' + settings.customHeaderTarget).length; //add first/last cell tags
                $('td, ' + settings.customHeaderTarget, this).each(function (index, el) { //iterate table cells
                    var $cell = $('<div>')
                        .addClass('dvdz-' + globalIndex++)
                        .addClass('dvdz-cell')
                        .addClass('dvdz-cell-' + index)
                        //mark the original table header cells
                        .addClass(($(this).is(settings.customHeaderTarget) ? 'data-exth data-exth-' + index : ''));

                    if (index === 0) { //mark first and last cell
                        $cell.addClass('first-cell');
                    } else if (index == (cellCount - 1)) {
                        $cell.addClass('last-cell');
                    }

                    if (settings.preserveDim) { //preserve cell dimensions
                        $cell.css({
                            'display'           : 'inline-block',
                            'vertical-align'    : 'top',
                            'line-height'       : $(el).outerHeight() + 'px',
                            'height'            : $(el).outerHeight() + 'px',
                            'width'             : $(el).outerWidth() + 'px',
                        });
                    }

                    //create label with content from table header (exclude header cells)
                    if (settings.addLabelHeaders && !$(this).is(settings.customHeaderTarget)) {
                        var $label = $('<div>')
                            .addClass('dvdz-' + globalIndex++)
                            .addClass('dvdz-label')
                            .addClass('dvdz-label-' + index)
                            .html(th[index]);

                        if (settings.hideLabels) {
                            $label.css('display', 'none');
                        }

                        $cell.append($label); //add label to our cell
                    }

                    var $labelData = $('<div>')
                        .addClass('dvdz-' + globalIndex++)
                        .addClass('dvdz-data')
                        .addClass('dvdz-data-' + index)
                        .html($(this).html()); //copy cell content into our data wrapper

                    if (settings.preserveDim) { //preserve dimensions of content
                        $labelData.css({
                            'display'           : 'inline-block',
                            'vertical-align'    : 'middle',
                            'line-height'       : 'normal',
                        });
                    }
                    $cell.append($labelData); //add content to our cell
                    $cell.appendTo($row); //add cell to our row
                }); //end each(function (index, el)
            }); //end each(function (i)

            if (settings.preserveEvents) { //restore events
                eventManager.restore($table);
            } //end if (settings.preserveEvents)
            return $table; //replace table
        }); //end replaceWith
    }; //end dividize
}(jQuery));
