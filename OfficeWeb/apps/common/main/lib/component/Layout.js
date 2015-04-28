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
 if (Common === undefined) {
    var Common = {};
}
define(["backbone"], function () {
    var BaseLayout = function (options) {
        this.box = null;
        this.panels = [];
        _.extend(this, options || {});
    };
    var LayoutPanel = function () {
        return {
            width: null,
            height: null,
            resize: false,
            stretch: false,
            rely: false
        };
    };
    _.extend(BaseLayout.prototype, Backbone.Events, {
        initialize: function (options) {
            this.$parent = this.box.parent();
            this.resize = {
                eventMove: _.bind(this.resizeMove, this),
                eventStop: _.bind(this.resizeStop, this)
            };
            var panel, resizer, stretch = false;
            options.items.forEach(function (item) {
                item.el instanceof HTMLElement && (item.el = $(item.el));
                panel = _.extend(new LayoutPanel(), item);
                if (panel.stretch) {
                    stretch = true;
                    panel.rely = false;
                    panel.resize = false;
                }
                this.panels.push(panel);
                if (panel.resize) {
                    resizer = {
                        isresizer: true,
                        minpos: panel.resize.min || 0,
                        maxpos: panel.resize.max || 0
                    };
                    if (!stretch) {
                        panel.resize.el = resizer.el = panel.el.after('<div class="layout-resizer after"></div>').next();
                        this.panels.push(resizer);
                    } else {
                        panel.resize.el = resizer.el = panel.el.before('<div class="layout-resizer before"></div>').prev();
                        this.panels.splice(this.panels.length - 1, 0, resizer);
                    }
                    panel.resize.hidden && resizer.el.hide();
                }
            },
            this);
        },
        doLayout: function () {},
        getElementHeight: function (el) {
            return parseInt(el.css("height"));
        },
        getElementWidth: function (el) {
            return parseInt(el.css("width"));
        },
        onSelectStart: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        },
        addHandler: function (elem, type, handler) {
            if (elem.addEventListener) {
                elem.addEventListener(type, handler);
            } else {
                if (elem.attachEvent) {
                    elem.attachEvent("on" + type, handler);
                } else {
                    elem["on" + type] = handler;
                }
            }
        },
        removeHandler: function (elem, type, handler) {
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handler);
            } else {
                if (elem.detachEvent) {
                    elem.detachEvent("on" + type, handler);
                } else {
                    elem["on" + type] = null;
                }
            }
        },
        clearSelection: function () {
            if (window.getSelection) {
                var selection = window.getSelection();
                if (selection.empty) {
                    selection.empty();
                } else {
                    if (selection.removeAllRanges) {
                        selection.removeAllRanges();
                    }
                }
            } else {
                if (document.selection) {
                    document.selection.empty();
                }
            }
        },
        resizeStart: function (e) {
            this.clearSelection();
            this.addHandler(window.document, "selectstart", this.onSelectStart);
            $(document).on({
                mousemove: this.resize.eventMove,
                mouseup: this.resize.eventStop
            });
            var panel = e.data.panel;
            this.resize.type = e.data.type;
            this.resize.$el = panel.el;
            this.resize.min = panel.minpos;
            this.resize.$el.addClass("move");
            if (e.data.type == "vertical") {
                this.resize.height = parseInt(this.resize.$el.css("height"));
                this.resize.max = (panel.maxpos > 0 ? panel.maxpos : this.resize.$el.parent().height() + panel.maxpos) - this.resize.height;
                this.resize.inity = e.pageY - parseInt(e.currentTarget.style.top);
            } else {
                if (e.data.type == "horizontal") {
                    this.resize.width = parseInt(this.resize.$el.css("width"));
                    this.resize.max = (panel.maxpos > 0 ? panel.maxpos : this.resize.$el.parent().height() + panel.maxpos) - this.resize.width;
                    this.resize.initx = e.pageX - parseInt(e.currentTarget.style.left);
                }
            }
        },
        resizeMove: function (e) {
            if (this.resize.type == "vertical") {
                var prop = "top",
                value = e.pageY - this.resize.inity;
            } else {
                if (this.resize.type == "horizontal") {
                    prop = "left";
                    value = e.pageX - this.resize.initx;
                }
            }
            if (! (value < this.resize.min) && !(value > this.resize.max)) {
                this.resize.$el[0].style[prop] = value + "px";
            }
        },
        resizeStop: function (e) {
            this.removeHandler(window.document, "selectstart", this.onSelectStart);
            $(document).off({
                mousemove: this.resize.eventMove,
                mouseup: this.resize.eventStop
            });
            if (this.resize.type == "vertical") {
                var prop = "height";
                var value = e.pageY - this.resize.inity;
            } else {
                if (this.resize.type == "horizontal") {
                    prop = "width";
                    value = e.pageX - this.resize.initx;
                }
            }
            value < this.resize.min && (value = this.resize.min);
            value > this.resize.max && (value = this.resize.max);
            if (this.resize.$el.hasClass("after")) {
                var panel = this.resize.$el.prev();
            } else {
                panel = this.resize.$el.next();
                value = panel.parent()[prop]() - (value + this.resize[prop]);
            }
            panel.css(prop, value + "px");
            this.resize.$el.removeClass("move");
            delete this.resize.$el;
            if (this.resize.value != value) {
                this.doLayout();
                this.trigger("layout:resizedrag", this);
            }
        }
    }); ! Common.UI && (Common.UI = {});
    Common.UI.VBoxLayout = function (options) {
        BaseLayout.apply(this, arguments);
        this.initialize.apply(this, arguments);
    };
    Common.UI.VBoxLayout.prototype = _.extend(new BaseLayout(), {
        initialize: function (options) {
            BaseLayout.prototype.initialize.call(this, options);
            this.panels.forEach(function (panel) { ! panel.stretch && !panel.height && (panel.height = this.getElementHeight(panel.el));
                if (panel.isresizer) {
                    panel.el.on("mousedown", {
                        type: "vertical",
                        panel: panel
                    },
                    _.bind(this.resizeStart, this));
                }
            },
            this);
            this.doLayout.call(this);
        },
        doLayout: function () {
            var height = 0,
            stretchable, style;
            this.panels.forEach(function (panel) {
                if (!panel.stretch) {
                    style = panel.el.is(":visible");
                    if (style) {
                        height += (panel.rely !== true ? panel.height : this.getElementHeight(panel.el));
                    }
                    if (panel.resize && panel.resize.autohide !== false && panel.resize.el) {
                        if (style) {
                            panel.resize.el.show();
                            stretchable && (height += panel.resize.height);
                        } else {
                            panel.resize.el.hide();
                            stretchable && (height -= panel.resize.height);
                        }
                    }
                } else {
                    stretchable = panel;
                }
            },
            this);
            stretchable && (stretchable.height = this.$parent.height() - height);
            height = 0;
            this.panels.forEach(function (panel) {
                if (panel.el.is(":visible")) {
                    style = {
                        top: height
                    };
                    panel.rely !== true && (style.height = panel.height);
                    panel.el.css(style);
                    height += this.getElementHeight(panel.el);
                }
            },
            this);
        }
    });
    Common.UI.HBoxLayout = function (options) {
        BaseLayout.apply(this, arguments);
        this.initialize.apply(this, arguments);
    };
    Common.UI.HBoxLayout.prototype = _.extend(new BaseLayout(), {
        initialize: function (options) {
            BaseLayout.prototype.initialize.call(this, options);
            this.panels.forEach(function (panel) { ! panel.stretch && !panel.width && (panel.width = this.getElementWidth(panel.el));
                if (panel.isresizer) {
                    panel.el.on("mousedown", {
                        type: "horizontal",
                        panel: panel
                    },
                    _.bind(this.resizeStart, this));
                }
            },
            this);
            this.doLayout.call(this);
        },
        doLayout: function (event) {
            var width = 0,
            stretchable, style;
            this.panels.forEach(function (panel) {
                if (!panel.stretch) {
                    style = panel.el.is(":visible");
                    if (style) {
                        width += (panel.rely !== true ? panel.width : this.getElementWidth(panel.el));
                    }
                    if (panel.resize && panel.resize.autohide !== false && panel.resize.el) {
                        if (style) {
                            panel.resize.el.show();
                            stretchable && (width -= panel.resize.width);
                        } else {
                            panel.resize.el.hide();
                            stretchable && (width -= panel.resize.width);
                        }
                    }
                } else {
                    stretchable = panel;
                }
            },
            this);
            stretchable && (stretchable.width = this.$parent.width() - width);
            width = 0;
            this.panels.forEach(function (panel) {
                if (panel.el.is(":visible")) {
                    style = {
                        left: width
                    };
                    panel.rely !== true && (style.width = panel.width);
                    panel.el.css(style);
                    width += this.getElementWidth(panel.el);
                }
            },
            this);
        }
    });
    Common.UI.VBoxLayout.prototype.constructor = Common.UI.VBoxLayout;
    Common.UI.HBoxLayout.prototype.constructor = Common.UI.HBoxLayout;
});