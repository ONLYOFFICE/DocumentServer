/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 (function ($) {
    var _superclass = $.fn.tooltip;
    _superclass.prototype = $.fn.tooltip.Constructor.prototype;
    $.extend($.fn.tooltip.Constructor.DEFAULTS, {
        container: "body",
        delay: {
            show: 500
        },
        arrow: false
    });
    var Tip = function (element, options) {
        this.init("tooltip", element, options);
    };
    Tip.prototype = $.extend({},
    $.fn.tooltip.Constructor.prototype, {
        constructor: Tip,
        init: function () {
            _superclass.prototype.init.apply(this, arguments);
            if (this.options.placement == "cursor") {
                if (/hover/.exec(this.options.trigger)) {
                    this.$element.on("mousemove.tooltip", this.options.selector, $.proxy(this.mousemove, this));
                }
            }
            if (this.options.zIndex) {
                this.tip().css("z-index", this.options.zIndex);
            }
            var me = this;
            Common.NotificationCenter.on({
                "layout:changed": function (e) {
                    if (!me.options.hideonclick && me.tip().is(":visible")) {
                        me.hide();
                    }
                }
            });
        },
        mousemove: function (e) {
            this.targetXY = [e.clientX, e.clientY];
        },
        leave: function (obj) {
            _superclass.prototype.leave.apply(this, arguments);
            this.dontShow = undefined;
        },
        show: function (at) {
            if (this.hasContent() && this.enabled && !this.dontShow) {
                if (!this.$element.is(":visible") && this.$element.closest("[role=menu]").length > 0) {
                    return;
                }
                var $tip = this.tip();
                var placement = typeof this.options.placement === "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
                if (this.options.arrow === false) {
                    $tip.addClass("arrow-free");
                }
                if (this.options.cls) {
                    $tip.addClass(this.options.cls);
                }
                var placementEx = /^([a-zA-Z]+)-?([a-zA-Z]*)$/.exec(placement);
                if (!at && !placementEx[2].length) {
                    _superclass.prototype.show.apply(this, arguments);
                } else {
                    var e = $.Event("show.bs.tooltip");
                    this.$element.trigger(e);
                    if (e.isDefaultPrevented()) {
                        return;
                    }
                    this.setContent();
                    if (this.options.animation) {
                        $tip.addClass("fade");
                    }
                    $tip.detach().css({
                        top: 0,
                        left: 0,
                        display: "block"
                    });
                    this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
                    if (typeof at == "object") {
                        var tp = {
                            top: at[1] + 15,
                            left: at[0] + 18
                        };
                        if (tp.left + $tip.width() > window.innerWidth) {
                            tp.left = window.innerWidth - $tip.width() - 30;
                        }
                        $tip.offset(tp).addClass("in");
                    } else {
                        var pos = this.getPosition();
                        var actualWidth = $tip[0].offsetWidth,
                        actualHeight = $tip[0].offsetHeight;
                        switch (placementEx[1]) {
                        case "bottom":
                            tp = {
                                top: pos.top + pos.height + 10
                            };
                            break;
                        case "top":
                            tp = {
                                top: pos.top - actualHeight - 10
                            };
                            break;
                        }
                        switch (placementEx[2]) {
                        case "left":
                            tp.left = pos.left;
                            if (this.$element.outerWidth() <= 18) {
                                tp.left -= 4;
                            }
                            break;
                        case "right":
                            tp.left = pos.left + pos.width - actualWidth;
                            if (this.$element.outerWidth() <= 18) {
                                tp.left += 4;
                            }
                            break;
                        }
                        this.applyPlacement(tp, placementEx[1]);
                        this.moveArrow();
                        $tip.addClass(placementEx[1]).addClass(placementEx[0]);
                    }
                    this.$element.trigger("shown.bs.tooltip");
                }
                var self = this;
                clearTimeout(self.timeout);
                self.timeout = setTimeout(function () {
                    if (self.hoverState == "in") {
                        self.hide();
                    }
                    self.dontShow = false;
                },
                5000);
            }
        },
        moveArrow: function () {
            var $arrow = this.tip().find(".tooltip-arrow, .arrow");
            var new_arrow_position = 10;
            switch (this.options.placement) {
            case "top-left":
                case "bottom-left":
                $arrow.css("left", new_arrow_position);
                break;
            case "top-right":
                case "bottom-right":
                $arrow.css("right", new_arrow_position);
                break;
            }
        },
        enter: function (obj) {
            if (obj.type !== "mouseenter") {
                return;
            }
            var $target = $(obj.target);
            if ($target.is("[role=menu]") || $target.parentsUntil(obj.currentTarget, "[role=menu]").length || this.tip().is(":visible")) {
                return;
            }
            var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data("bs.tooltip");
            clearTimeout(self.timeout);
            self.hoverState = "in";
            if (!self.options.delay || !self.options.delay.show) {
                self.show();
            } else {
                self.timeout = setTimeout(function () {
                    if (self.hoverState == "in") {
                        self.show(self.options.placement == "cursor" ? self.targetXY : undefined);
                    }
                },
                self.options.delay.show);
            }
        },
        replaceArrow: function (delta, dimension, position) {
            this.options.arrow === false ? this.arrow().hide() : _superclass.prototype.replaceArrow.apply(this, arguments);
        },
        getCalculatedOffset: function (placement, pos, actualWidth, actualHeight) {
            var out = _superclass.prototype.getCalculatedOffset.apply(this, arguments);
            if (this.options.offset > 0 || this.options.offset < 0) {
                switch (/(bottom|top)/.exec(placement)[1]) {
                case "bottom":
                    out.top += this.options.offset;
                    break;
                case "top":
                    out.top -= this.options.offset;
                    break;
                }
            }
            return out;
        }
    });
    var old = $.fn.tooltip;
    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this),
            data = $this.data("bs.tooltip"),
            options = typeof option === "object" && option;
            if (!data) {
                $this.data("bs.tooltip", (data = new Tip(this, options)));
            }
            if (typeof option === "string") {
                data[option]();
            }
        });
    };
    $.fn.tooltip.Constructor = Tip;
    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };
})(window.jQuery);