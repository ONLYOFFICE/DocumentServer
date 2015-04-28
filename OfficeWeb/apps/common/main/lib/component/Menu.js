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
define(["common/main/lib/extend/Bootstrap", "common/main/lib/component/BaseView", "common/main/lib/component/MenuItem", "common/main/lib/component/Scroller"], function () {
    Common.UI.Menu = (function () {
        var manager = (function () {
            var active = [],
            menus = {};
            return {
                register: function (menu) {
                    menus[menu.id] = menu;
                    menu.on("show:after", function (m) {
                        active.push(m);
                    }).on("hide:after", function (m) {
                        var index = active.indexOf(m);
                        if (index > -1) {
                            active.splice(index, 1);
                        }
                    });
                },
                unregister: function (menu) {
                    var index = active.indexOf(menu);
                    delete menus[menu.id];
                    if (index > -1) {
                        active.splice(index, 1);
                    }
                    menu.off("show:after").off("hide:after");
                },
                hideAll: function () {
                    Common.NotificationCenter.trigger("menumanager:hideall");
                    if (active && active.length > 0) {
                        _.each(active, function (menu) {
                            menu.hide();
                        });
                        return true;
                    }
                    return false;
                }
            };
        })();
        return _.extend(Common.UI.BaseView.extend({
            options: {
                cls: "",
                style: "",
                itemTemplate: null,
                items: [],
                menuAlign: "tl-bl",
                menuAlignEl: null,
                offset: [0, 0]
            },
            template: _.template(['<ul class="dropdown-menu <%= options.cls %>" style="<%= options.style %>" role="menu"></ul>'].join("")),
            initialize: function (options) {
                Common.UI.BaseView.prototype.initialize.call(this, options);
                var me = this;
                this.id = this.options.id || Common.UI.getId();
                this.itemTemplate = this.options.itemTemplate || Common.UI.MenuItem.prototype.template;
                this.rendered = false;
                this.items = [];
                this.offset = [0, 0];
                this.menuAlign = this.options.menuAlign;
                this.menuAlignEl = this.options.menuAlignEl;
                _.each(this.options.items, function (item) {
                    if (item instanceof Common.UI.MenuItem) {
                        me.items.push(item);
                    } else {
                        me.items.push(new Common.UI.MenuItem(_.extend({
                            tagName: "li",
                            template: me.itemTemplate
                        },
                        item)));
                    }
                });
                if (this.options.el) {
                    this.render();
                }
                manager.register(this);
            },
            remove: function () {
                manager.unregister(this);
                Common.UI.BaseView.prototype.remove.call(this);
            },
            render: function (parentEl) {
                var me = this;
                this.trigger("render:before", this);
                this.cmpEl = $(this.el);
                if (parentEl) {
                    this.setElement(parentEl, false);
                    if (!me.rendered) {
                        this.cmpEl = $(this.template({
                            options: me.options
                        }));
                        parentEl.append(this.cmpEl);
                    }
                } else {
                    if (!me.rendered) {
                        this.cmpEl = this.template({
                            options: me.options
                        });
                        $(this.el).append(this.cmpEl);
                    }
                }
                var rootEl = this.cmpEl.parent(),
                menuRoot = (rootEl.attr("role") === "menu") ? rootEl : rootEl.find("[role=menu]");
                if (menuRoot) {
                    if (!me.rendered) {
                        _.each(me.items || [], function (item) {
                            menuRoot.append(item.render().el);
                            item.on("click", _.bind(me.onItemClick, me));
                            item.on("toggle", _.bind(me.onItemToggle, me));
                        });
                    }
                    menuRoot.css({
                        "max-height": me.options.maxHeight || "none",
                        position: "fixed",
                        right: "auto",
                        left: -1000,
                        top: -1000
                    });
                    this.parentEl = menuRoot.parent();
                    this.parentEl.on("show.bs.dropdown", _.bind(me.onBeforeShowMenu, me));
                    this.parentEl.on("shown.bs.dropdown", _.bind(me.onAfterShowMenu, me));
                    this.parentEl.on("hide.bs.dropdown", _.bind(me.onBeforeHideMenu, me));
                    this.parentEl.on("hidden.bs.dropdown", _.bind(me.onAfterHideMenu, me));
                    this.parentEl.on("keydown.after.bs.dropdown", _.bind(me.onAfterKeydownMenu, me));
                    menuRoot.on("scroll", _.bind(me.onScroll, me));
                    menuRoot.hover(function (e) {
                        me.isOver = true;
                    },
                    function (e) {
                        me.isOver = false;
                    });
                }
                this.rendered = true;
                this.trigger("render:after", this);
                return this;
            },
            isVisible: function () {
                return this.rendered && (this.cmpEl.is(":visible"));
            },
            show: function () {
                if (this.rendered && this.parentEl && !this.parentEl.hasClass("open")) {
                    this.cmpEl.dropdown("toggle");
                }
            },
            hide: function () {
                if (this.rendered && this.parentEl && this.parentEl.hasClass("open")) {
                    this.cmpEl.dropdown("toggle");
                }
            },
            insertItem: function (index, item) {
                var me = this,
                el = this.cmpEl;
                if (! (item instanceof Common.UI.MenuItem)) {
                    item = new Common.UI.MenuItem(_.extend({
                        tagName: "li",
                        template: me.itemTemplate
                    },
                    item));
                }
                if (index < 0 || index >= me.items.length) {
                    me.items.push(item);
                } else {
                    me.items.splice(index, 0, item);
                }
                if (this.rendered) {
                    var menuRoot = (el.attr("role") === "menu") ? el : el.find("[role=menu]");
                    if (menuRoot) {
                        if (index < 0) {
                            menuRoot.append(item.render().el);
                        } else {
                            if (index === 0) {
                                menuRoot.prepend(item.render().el);
                            } else {
                                $("li:nth-child(" + index + ")", menuRoot).before(item.render().el);
                            }
                        }
                        item.on("click", _.bind(me.onItemClick, me));
                        item.on("toggle", _.bind(me.onItemToggle, me));
                    }
                }
            },
            doLayout: function () {
                if (this.options.maxHeight > 0) {
                    if (!this.rendered) {
                        this.mustLayout = true;
                        return;
                    }
                    var me = this,
                    el = this.cmpEl;
                    var menuRoot = (el.attr("role") === "menu") ? el : el.find("[role=menu]");
                    if (!menuRoot.is(":visible")) {
                        var pos = [menuRoot.css("left"), menuRoot.css("top")];
                        menuRoot.css({
                            left: "-1000px",
                            top: "-1000px",
                            display: "block"
                        });
                    }
                    var $items = menuRoot.find("li");
                    if ($items.height() * $items.length > this.options.maxHeight) {
                        var scroll = '<div class="menu-scroll top"></div>';
                        menuRoot.prepend(scroll);
                        scroll = '<div class="menu-scroll bottom"></div>';
                        menuRoot.append(scroll);
                        menuRoot.css({
                            "box-shadow": "none",
                            "overflow-y": "hidden",
                            "padding-top": "18px"
                        });
                        menuRoot.find("> li:last-of-type").css("margin-bottom", 18);
                        var addEvent = function (elem, type, fn) {
                            elem.addEventListener ? elem.addEventListener(type, fn, false) : elem.attachEvent("on" + type, fn);
                        };
                        var eventname = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
                        addEvent(menuRoot[0], eventname, _.bind(this.onMouseWheel, this));
                        menuRoot.find(".menu-scroll").on("click", _.bind(this.onScrollClick, this));
                    }
                    if (pos) {
                        menuRoot.css({
                            display: "",
                            left: pos[0],
                            top: pos[1]
                        });
                    }
                }
            },
            addItem: function (item) {
                this.insertItem(-1, item);
            },
            removeItem: function (item) {
                var me = this,
                index = me.items.indexOf(item);
                if (index > -1) {
                    me.items.splice(index, 1);
                    item.off("click").off("toggle");
                    item.remove();
                }
            },
            removeAll: function () {
                var me = this;
                _.each(me.items, function (item) {
                    item.off("click").off("toggle");
                    item.remove();
                });
                me.items = [];
            },
            onBeforeShowMenu: function (e) {
                if (this.mustLayout) {
                    delete this.mustLayout;
                    this.doLayout.call(this);
                }
                this.trigger("show:before", this, e);
                this.alignPosition();
            },
            onAfterShowMenu: function (e) {
                this.trigger("show:after", this, e);
                if (this.$el.find("> ul > .menu-scroll").length) {
                    var el = this.$el.find("li .checked")[0];
                    if (el) {
                        var offset = el.offsetTop - this.options.maxHeight / 2;
                        this.scrollMenu(offset < 0 ? 0 : offset);
                    }
                }
            },
            onBeforeHideMenu: function (e) {
                this.trigger("hide:before", this, e);
                if (Common.UI.Scroller.isMouseCapture()) {
                    e.preventDefault();
                }
            },
            onAfterHideMenu: function (e) {
                this.trigger("hide:after", this, e);
            },
            onAfterKeydownMenu: function (e) {
                if (e.keyCode == Common.UI.Keys.RETURN) {
                    var li = $(e.target).closest("li");
                    if (li.length <= 0) {
                        li = $(e.target).parent().find("li .dataview");
                    }
                    if (li.length > 0) {
                        li.click();
                    }
                } else {
                    if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN) {
                        this.fromKeyDown = true;
                    }
                }
            },
            onScroll: function (item, e) {
                if (this.fromKeyDown) {
                    var menuRoot = (this.cmpEl.attr("role") === "menu") ? this.cmpEl : this.cmpEl.find("[role=menu]");
                    menuRoot.find(".menu-scroll.top").css("top", menuRoot.scrollTop() + "px");
                    menuRoot.find(".menu-scroll.bottom").css("bottom", (-menuRoot.scrollTop()) + "px");
                }
            },
            onItemClick: function (item, e) {
                if (!item.menu) {
                    this.isOver = false;
                }
                if (item.options.stopPropagation) {
                    e.stopPropagation();
                    var me = this;
                    _.delay(function () {
                        me.$el.parent().parent().find("[data-toggle=dropdown]").focus();
                    },
                    10);
                    return;
                }
                this.trigger("item:click", this, item, e);
            },
            onItemToggle: function (item, state, e) {
                this.trigger("item:toggle", this, item, state, e);
            },
            onScrollClick: function (e) {
                this.scrollMenu(/top/.test(e.currentTarget.className));
                return false;
            },
            onMouseWheel: function (e) {
                this.scrollMenu(((e.detail && -e.detail) || e.wheelDelta) > 0);
            },
            scrollMenu: function (up) {
                this.fromKeyDown = false;
                var menuRoot = (this.cmpEl.attr("role") === "menu") ? this.cmpEl : this.cmpEl.find("[role=menu]"),
                value = typeof(up) === "boolean" ? menuRoot.scrollTop() + (up ? -20 : 20) : up;
                menuRoot.scrollTop(value);
                menuRoot.find(".menu-scroll.top").css("top", menuRoot.scrollTop() + "px");
                menuRoot.find(".menu-scroll.bottom").css("bottom", (-menuRoot.scrollTop()) + "px");
            },
            setOffset: function (offsetX, offsetY) {
                this.offset[0] = _.isUndefined(offsetX) ? this.offset[0] : offsetX;
                this.offset[1] = _.isUndefined(offsetY) ? this.offset[1] : offsetY;
                this.alignPosition();
            },
            getOffset: function () {
                return this.offset;
            },
            alignPosition: function () {
                var menuRoot = (this.cmpEl.attr("role") === "menu") ? this.cmpEl : this.cmpEl.find("[role=menu]"),
                menuParent = this.menuAlignEl || menuRoot.parent(),
                m = this.menuAlign.match(/^([a-z]+)-([a-z]+)/),
                offset = menuParent.offset(),
                docW = Math.min($(document).width(), $("body").width()),
                docH = $(document).height() - 10,
                menuW = menuRoot.outerWidth(),
                menuH = menuRoot.outerHeight(),
                parentW = menuParent.outerWidth(),
                parentH = menuParent.outerHeight();
                var posMenu = {
                    "tl": [0, 0],
                    "bl": [0, menuH],
                    "tr": [menuW, 0],
                    "br": [menuW, menuH]
                };
                var posParent = {
                    "tl": [0, 0],
                    "tr": [parentW, 0],
                    "bl": [0, parentH],
                    "br": [parentW, parentH]
                };
                var left = offset.left - posMenu[m[1]][0] + posParent[m[2]][0] + this.offset[0];
                var top = offset.top - posMenu[m[1]][1] + posParent[m[2]][1] + this.offset[1];
                if (left + menuW > docW) {
                    if (menuParent.is("li.dropdown-submenu")) {
                        left = offset.left - menuW + 2;
                    } else {
                        left = docW - menuW;
                    }
                }
                if (top + menuH > docH) {
                    top = docH - menuH;
                }
                if (top < 0) {
                    top = 0;
                }
                menuRoot.css({
                    left: left,
                    top: top
                });
            }
        }), {
            Manager: (function () {
                return manager;
            })()
        });
    })();
});