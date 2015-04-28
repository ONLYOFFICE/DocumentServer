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
 define(["common/main/lib/component/BaseView", "common/main/lib/component/Tab"], function () {
    var Events = {
        bind: function () {
            if (!this.o) {
                this.o = $({});
            }
            this.o.on.apply(this.o, arguments);
        },
        unbind: function () {
            if (this.o) {
                this.o.off.apply(this.o, arguments);
            }
        },
        trigger: function () {
            if (!this.o) {
                this.o = $({});
            }
            this.o.trigger.apply(this.o, arguments);
        }
    };
    var StateManager = function (options) {
        this.initialize.call(this, options);
    };
    _.extend(StateManager.prototype, Events);
    StateManager.prototype.initialize = function (options) {
        this.bar = options.bar;
    };
    StateManager.prototype.attach = function (tab) {
        tab.changeState = $.proxy(function () {
            this.trigger("tab:change", tab);
            this.bar.$el.find("ul > li.active").removeClass("active");
            tab.activate();
            this.bar.trigger("tab:changed", this.bar, this.bar.tabs.indexOf(tab), tab);
        },
        this);
        var dragHelper = new(function () {
            return {
                bounds: [],
                drag: undefined,
                calculateBounds: function () {
                    var me = this,
                    length = me.bar.tabs.length,
                    barBounds = me.bar.$bar.get(0).getBoundingClientRect();
                    if (barBounds) {
                        me.bounds = [];
                        me.scrollLeft = me.bar.$bar.scrollLeft();
                        me.bar.scrollX = this.scrollLeft;
                        for (var i = 0; i < length; ++i) {
                            this.bounds.push(me.bar.tabs[i].$el.get(0).getBoundingClientRect());
                        }
                        me.tabBarLeft = me.bounds[0].left;
                        me.tabBarRight = me.bounds[length - 1].right;
                        me.tabBarRight = Math.min(me.tabBarRight, barBounds.right - 1);
                    }
                },
                setAbsTabs: function () {
                    var me = this,
                    tab = null,
                    length = this.bounds.length;
                    for (var i = 0; i < length; ++i) {
                        tab = me.bar.tabs[i].$el;
                        tab.css("position", "absolute");
                        tab.css("left", (me.bounds[i].left - me.tabBarLeft - this.scrollLeft) + "px");
                        if (tab.hasClass("active")) {
                            tab.css("top", "1px");
                        } else {
                            tab.css("top", "0px");
                        }
                    }
                },
                updatePositions: function () {
                    this.drag.place = undefined;
                    var i, tabBound, center, place = -1,
                    next = -this.scrollLeft,
                    tabsCount = this.bounds.length,
                    dragBound = this.drag.tab.$el.get(0).getBoundingClientRect();
                    if (this.drag.moveX - this.drag.mouseX > 0) {
                        for (i = tabsCount - 1; i >= 0; --i) {
                            tabBound = this.bounds[i];
                            center = (tabBound.right + tabBound.left) * 0.5;
                            if (dragBound.left < center && center < dragBound.right) {
                                place = i;
                                break;
                            }
                        }
                        if (-1 === place) {
                            for (i = tabsCount - 1; i >= 0; --i) {
                                tabBound = dragBound;
                                center = (tabBound.right + tabBound.left) * 0.5;
                                if (this.bounds[i].left < center && center < this.bounds[i].right) {
                                    place = i;
                                    break;
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < tabsCount; ++i) {
                            tabBound = this.bounds[i];
                            center = (tabBound.right + tabBound.left) * 0.5;
                            if (dragBound.left < center && center < dragBound.right) {
                                place = i;
                                break;
                            }
                        }
                        if (-1 === place) {
                            for (i = 0; i < tabsCount; ++i) {
                                tabBound = dragBound;
                                center = (tabBound.right + tabBound.left) * 0.5;
                                if (this.bounds[i].left < center && center < this.bounds[i].right) {
                                    place = i;
                                    break;
                                }
                            }
                        }
                    }
                    if (-1 !== place) {
                        this.drag.place = place;
                        for (i = 0; i < tabsCount; ++i) {
                            if (i === place) {
                                if (place < this.drag.index) {
                                    next += this.drag.tabWidth;
                                }
                            }
                            if (place > this.drag.index) {
                                if (i === place + 1) {
                                    next += this.drag.tabWidth;
                                }
                            }
                            if (i !== this.drag.index) {
                                this.bar.tabs[i].$el.css("left", next + "px");
                            } else {
                                if (this.drag.index === place) {
                                    next += this.drag.tabWidth;
                                }
                                continue;
                            }
                            next += this.bounds[i].width;
                        }
                    }
                },
                setHook: function (e, bar, tab) {
                    var me = this;
                    function dragComplete() {
                        if (!_.isUndefined(me.drag)) {
                            me.drag.tab.$el.css("z-index", "");
                            var tab = null;
                            for (var i = me.bar.tabs.length - 1; i >= 0; --i) {
                                tab = me.bar.tabs[i].$el;
                                if (tab) {
                                    tab.css("top", "");
                                    tab.css("position", "");
                                    tab.css("left", "");
                                }
                            }
                            if (!_.isUndefined(me.drag.place)) {
                                me.bar.trigger("tab:move", me.drag.index, me.drag.place);
                                me.bar.$bar.scrollLeft(me.scrollLeft);
                                me.bar.scrollX = undefined;
                            } else {
                                me.bar.trigger("tab:move", me.drag.index);
                                me.bar.$bar.scrollLeft(me.scrollLeft);
                                me.bar.scrollX = undefined;
                            }
                            me.drag = undefined;
                        }
                    }
                    function dragMove(e) {
                        if (!_.isUndefined(me.drag)) {
                            me.drag.moveX = e.clientX;
                            var leftPos = Math.max(e.clientX - me.drag.anchorX - me.tabBarLeft - me.scrollLeft, 0);
                            leftPos = Math.min(leftPos, me.tabBarRight - me.tabBarLeft - me.drag.tabWidth - me.scrollLeft);
                            me.drag.tab.$el.css("left", leftPos + "px");
                            me.drag.tab.$el.css("z-index", "100");
                            me.updatePositions();
                        }
                    }
                    function dragDropText(e) {
                        e.preventDefault();
                    }
                    if (!_.isUndefined(bar) && !_.isUndefined(tab) && bar.tabs.length > 1) {
                        var index = bar.tabs.indexOf(tab);
                        me.bar = bar;
                        me.drag = {
                            tab: tab,
                            index: index
                        };
                        this.calculateBounds();
                        this.setAbsTabs();
                        me.drag.moveX = e.clientX;
                        me.drag.mouseX = e.clientX;
                        me.drag.anchorX = e.clientX - this.bounds[index].left;
                        me.drag.tabWidth = this.bounds[index].width;
                        document.addEventListener("dragstart", dragDropText);
                        $(document).on("mousemove", dragMove);
                        $(document).on("mouseup", function (e) {
                            dragComplete(e);
                            $(document).off("mouseup", dragComplete);
                            $(document).off("mousemove", dragMove);
                            document.removeEventListener("dragstart", dragDropText);
                        });
                    }
                }
            };
        });
        tab.$el.on({
            click: $.proxy(function () {
                if (!tab.disabled && !tab.$el.hasClass("active")) {
                    if (tab.control == "manual") {
                        this.bar.trigger("tab:manual", this.bar, this.bar.tabs.indexOf(tab), tab);
                    } else {
                        tab.changeState();
                    }
                }
            },
            this),
            dblclick: $.proxy(function () {
                this.trigger("tab:dblclick", this, this.tabs.indexOf(tab), tab);
            },
            this.bar),
            contextmenu: $.proxy(function () {
                this.trigger("tab:contextmenu", this, this.tabs.indexOf(tab), tab);
            },
            this.bar),
            mousedown: $.proxy(function (e) {
                if (this.bar.options.draggable && !_.isUndefined(dragHelper) && (3 !== e.which)) {
                    if (!tab.isLockTheDrag) {
                        dragHelper.setHook(e, this.bar, tab);
                    }
                }
            },
            this)
        });
    };
    StateManager.prototype.detach = function (tab) {
        tab.$el.off();
    };
    Common.UI.TabBar = Common.UI.BaseView.extend({
        config: {
            placement: "top",
            items: [],
            draggable: false
        },
        tabs: [],
        template: _.template('<ul class="nav nav-tabs <%= placement %>" />'),
        initialize: function (options) {
            _.extend(this.config, options);
            Common.UI.BaseView.prototype.initialize.call(this, options);
            this.saved = [];
        },
        render: function () {
            this.$el.html(this.template(this.config));
            this.$bar = this.$el.find("ul");
            var addEvent = function (elem, type, fn) {
                elem.addEventListener ? elem.addEventListener(type, fn, false) : elem.attachEvent("on" + type, fn);
            };
            var eventname = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
            addEvent(this.$bar[0], eventname, _.bind(this._onMouseWheel, this));
            this.manager = new StateManager({
                bar: this
            });
            this.insert(-1, this.config.items);
            this.insert(-1, this.saved);
            delete this.saved;
            this.rendered = true;
            return this;
        },
        _onMouseWheel: function (e) {
            var hidden = this.checkInvisible(true),
            forward = ((e.detail && -e.detail) || e.wheelDelta) > 0;
            if (forward) {
                if (hidden.last) {
                    this.setTabVisible("forward");
                }
            } else {
                if (hidden.first) {
                    this.setTabVisible("backward");
                }
            }
        },
        add: function (tabs) {
            return this.insert(-1, tabs) > 0;
        },
        insert: function (index, tabs) {
            var count = 0;
            if (tabs) {
                if (! (tabs instanceof Array)) {
                    tabs = [tabs];
                }
                if (tabs.length) {
                    count = tabs.length;
                    if (this.rendered) {
                        var me = this,
                        tab;
                        if (index < 0 || index > me.tabs.length) {
                            for (var i = 0; i < tabs.length; i++) {
                                tab = new Common.UI.Tab(tabs[i]);
                                me.$bar.append(tab.render().$el);
                                me.tabs.push(tab);
                                me.manager.attach(tab);
                            }
                        } else {
                            for (i = tabs.length; i-->0;) {
                                tab = new Common.UI.Tab(tabs[i]);
                                if (index === 0) {
                                    me.$bar.prepend(tab.render().$el);
                                    me.tabs.unshift(tab);
                                } else {
                                    me.$bar.find("li:nth-child(" + index + ")").before(tab.render().$el);
                                    me.tabs.splice(index, 0, tab);
                                }
                                me.manager.attach(tab);
                            }
                        }
                    } else {
                        this.saved.push(tabs);
                    }
                    this.checkInvisible();
                }
            }
            return count;
        },
        remove: function (index) {
            if (index >= 0 && index < this.tabs.length) {
                var tab = this.tabs.splice(index, 1)[0];
                this.manager.detach(tab);
                tab.$el.remove();
                this.checkInvisible();
            }
        },
        empty: function (suppress) {
            var me = this;
            this.tabs.forEach(function (tab) {
                me.manager.detach(tab);
            });
            this.$bar.empty();
            me.tabs = [];
            this.checkInvisible(suppress);
        },
        setActive: function (t) {
            if (t instanceof Common.UI.Tab) {
                tab = t;
            } else {
                if (typeof t == "number") {
                    if (t >= 0 && t < this.tabs.length) {
                        var tab = this.tabs[t];
                    }
                }
            }
            if (tab && tab.control != "manual" && !tab.disabled && !tab.$el.hasClass("active")) {
                tab.changeState();
            }
            this.checkInvisible();
        },
        getActive: function (iselem) {
            return iselem ? this.$bar.find("> li.active") : this.$bar.find("> li.active").index();
        },
        getAt: function (index) {
            return (index >= 0 && index < this.tabs.length) ? this.tabs[index] : undefined;
        },
        getCount: function () {
            return this.tabs.length;
        },
        addClass: function (cls) {
            if (cls.length && !this.$bar.hasClass(cls)) {
                this.$bar.addClass(cls);
            }
        },
        removeClass: function (cls) {
            if (cls.length && this.$bar.hasClass(cls)) {
                this.$bar.removeClass(cls);
            }
        },
        hasClass: function (cls) {
            return this.$bar.hasClass(cls);
        },
        setTabVisible: function (index, suppress) {
            if (index <= 0 || index == "first") {
                this.$bar.scrollLeft(0);
                this.checkInvisible(suppress);
            } else {
                if (index >= (this.tabs.length - 1) || index == "last") {
                    var left = this.tabs[this.tabs.length - 1].$el.position().left;
                    this.$bar.scrollLeft(left);
                    this.checkInvisible(suppress);
                } else {
                    var rightbound = this.$bar.width();
                    if (index == "forward") {
                        var tab, right;
                        for (var i = 0; i < this.tabs.length; i++) {
                            tab = this.tabs[i].$el;
                            right = tab.position().left + parseInt(tab.css("width"));
                            if (right > rightbound) {
                                this.$bar.scrollLeft(this.$bar.scrollLeft() + (right - rightbound) + 20);
                                this.checkInvisible(suppress);
                                break;
                            }
                        }
                    } else {
                        if (index == "backward") {
                            for (i = this.tabs.length; i-->0;) {
                                tab = this.tabs[i].$el;
                                left = tab.position().left;
                                if (left < 0) {
                                    this.$bar.scrollLeft(this.$bar.scrollLeft() + left - 26);
                                    this.checkInvisible(suppress);
                                    break;
                                }
                            }
                        } else {
                            if (typeof index == "number") {
                                tab = this.tabs[index].$el;
                                left = tab.position().left;
                                right = left + parseInt(tab.css("width"));
                                if (left < 0) {
                                    this.$bar.scrollLeft(this.$bar.scrollLeft() + left - 26);
                                    this.checkInvisible(suppress);
                                } else {
                                    if (right > rightbound) {
                                        this.$bar.scrollLeft(this.$bar.scrollLeft() + (right - rightbound) + 20);
                                        this.checkInvisible(suppress);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        checkInvisible: function (suppress) {
            var result = {
                first: !this.isTabVisible(0),
                last: !this.isTabVisible(this.tabs.length - 1)
            }; ! suppress && this.fireEvent("tab:invisible", this, result);
            return result;
        },
        hasInvisible: function () {
            var _left_bound_ = this.$bar.offset().left,
            _right_bound_ = _left_bound_ + this.$bar.width();
            for (var i = this.tabs.length; i-->0;) {
                if (!this.isTabVisible(i, _left_bound_, _right_bound_)) {
                    return true;
                }
            }
            return false;
        },
        isTabVisible: function (index) {
            var leftbound = arguments[1] || this.$bar.offset().left,
            rightbound = arguments[2] || (leftbound + this.$bar.width()),
            left,
            right,
            tab,
            rect;
            if (index < this.tabs.length && index >= 0) {
                tab = this.tabs[index].$el;
                rect = tab.get(0).getBoundingClientRect();
                left = rect.left;
                right = rect.right;
                return ! (left < leftbound) && !(right > rightbound);
            }
            return false;
        }
    });
});