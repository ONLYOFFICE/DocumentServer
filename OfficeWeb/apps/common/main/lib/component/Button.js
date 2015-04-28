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
define(["common/main/lib/component/BaseView", "common/main/lib/component/ToggleManager"], function () {
    Common.UI.Button = Common.UI.BaseView.extend({
        options: {
            id: null,
            hint: false,
            enableToggle: false,
            allowDepress: true,
            toggleGroup: null,
            cls: "",
            iconCls: "",
            caption: "",
            menu: null,
            disabled: false,
            pressed: false,
            split: false
        },
        template: _.template(["<% if (menu == null) { %>", '<button type="button" class="btn <%= cls %>" id="<%= id %>" style="<%= style %>">', '<span class="caption"><%= caption %></span>', '<% if (iconCls != "") { %>', '<span class="btn-icon <%= iconCls %>">&nbsp;</span>', "<% } %>", "</button>", "<% } else if (split == false) {%>", '<div class="btn-group" id="<%= id %>" style="<%= style %>">', '<button type="button" class="btn dropdown-toggle <%= cls %>" data-toggle="dropdown">', '<span class="caption"><%= caption %></span>', '<% if (iconCls != "") { %>', '<span class="btn-icon <%= iconCls %>">&nbsp;</span>', "<% } %>", '<span class="caret"></span>', "</button>", "</div>", "<% } else { %>", '<div class="btn-group split" id="<%= id %>" style="<%= style %>">', '<button type="button" class="btn <%= cls %>">', '<span class="caption"><%= caption %></span>', '<% if (iconCls != "") { %>', '<span class="btn-icon <%= iconCls %>">&nbsp;</span>', "<% } %>", "</button>", '<button type="button" class="btn <%= cls %> dropdown-toggle" data-toggle="dropdown">', '<span class="caret"></span>', '<span class="sr-only"></span>', "</button>", "</div>", "<% } %>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this;
            me.id = me.options.id || Common.UI.getId();
            me.hint = me.options.hint;
            me.enableToggle = me.options.enableToggle;
            me.allowDepress = me.options.allowDepress;
            me.cls = me.options.cls;
            me.iconCls = me.options.iconCls;
            me.menu = me.options.menu;
            me.split = me.options.split;
            me.toggleGroup = me.options.toggleGroup;
            me.disabled = me.options.disabled;
            me.pressed = me.options.pressed;
            me.caption = me.options.caption;
            me.template = me.options.template || me.template;
            me.style = me.options.style;
            me.rendered = false;
            if (me.options.el) {
                me.render();
            }
        },
        render: function (parentEl) {
            var me = this;
            me.trigger("render:before", me);
            me.cmpEl = $(me.el);
            if (parentEl) {
                me.setElement(parentEl, false);
                if (!me.rendered) {
                    me.cmpEl = $(this.template({
                        id: me.id,
                        cls: me.cls,
                        iconCls: me.iconCls,
                        menu: me.menu,
                        split: me.split,
                        disabled: me.disabled,
                        pressed: me.pressed,
                        caption: me.caption,
                        style: me.style
                    }));
                    if (me.menu && _.isFunction(me.menu.render)) {
                        me.menu.render(me.cmpEl);
                    }
                    parentEl.html(me.cmpEl);
                }
            }
            if (!me.rendered) {
                var el = me.cmpEl,
                isGroup = el.hasClass("btn-group"),
                isSplit = el.hasClass("split");
                if (me.options.hint) {
                    var modalParents = me.cmpEl.closest(".asc-window");
                    me.cmpEl.attr("data-toggle", "tooltip");
                    me.cmpEl.tooltip({
                        title: me.options.hint,
                        placement: me.options.hintAnchor || "cursor"
                    });
                    if (modalParents.length > 0) {
                        me.cmpEl.data("bs.tooltip").tip().css("z-index", parseInt(modalParents.css("z-index")) + 10);
                    }
                }
                if (_.isString(me.toggleGroup)) {
                    me.enableToggle = true;
                }
                var buttonHandler = function (e) {
                    if (!me.disabled && e.which == 1) {
                        me.doToggle();
                        if (me.options.hint) {
                            var tip = me.cmpEl.data("bs.tooltip");
                            if (tip) {
                                if (tip.dontShow === undefined) {
                                    tip.dontShow = true;
                                }
                                tip.hide();
                            }
                        }
                        me.trigger("click", me, e);
                    }
                };
                var doSplitSelect = function (select, e) {
                    if (!select) {
                        var isUnderMouse = false;
                        _.each($("button", el), function (el) {
                            if ($(el).is(":hover")) {
                                isUnderMouse = true;
                                return false;
                            }
                        });
                        if (!isUnderMouse) {
                            el.removeClass("over");
                            $("button", el).removeClass("over");
                        }
                    }
                    if (!select && (me.enableToggle && me.allowDepress && me.pressed)) {
                        return;
                    }
                    if (select && !isSplit && (me.enableToggle && me.allowDepress && !me.pressed)) {
                        e.preventDefault();
                        return;
                    }
                    $("button:first", el).toggleClass("active", select);
                    $("[data-toggle^=dropdown]", el).toggleClass("active", select);
                    el.toggleClass("active", select);
                };
                var menuHandler = function (e) {
                    if (!me.disabled && e.which == 1) {
                        if (isSplit) {
                            if (me.options.hint) {
                                var tip = me.cmpEl.data("bs.tooltip");
                                if (tip) {
                                    if (tip.dontShow === undefined) {
                                        tip.dontShow = true;
                                    }
                                    tip.hide();
                                }
                            }
                            var isOpen = el.hasClass("open");
                            doSplitSelect(!isOpen, e);
                        }
                    }
                };
                var doSetActiveState = function (e, state) {
                    if (isSplit) {
                        doSplitSelect(state, e);
                    } else {
                        el.toggleClass("active", state);
                        $("button", el).toggleClass("active", state);
                    }
                };
                var onMouseDown = function (e) {
                    doSplitSelect(true, e);
                    $(document).on("mouseup", onMouseUp);
                };
                var onMouseUp = function (e) {
                    doSplitSelect(false, e);
                    $(document).off("mouseup", onMouseUp);
                };
                var onAfterHideMenu = function (e) {
                    me.cmpEl.find(".dropdown-toggle").blur();
                };
                if (isGroup) {
                    if (isSplit) {
                        $("[data-toggle^=dropdown]", el).on("mousedown", _.bind(menuHandler, this));
                        $("button", el).on("mousedown", _.bind(onMouseDown, this));
                    }
                    el.on("hide.bs.dropdown", _.bind(doSplitSelect, me, false));
                    el.on("show.bs.dropdown", _.bind(doSplitSelect, me, true));
                    el.on("hidden.bs.dropdown", _.bind(onAfterHideMenu, me));
                    $("button:first", el).on("click", buttonHandler);
                } else {
                    el.on("click", buttonHandler);
                }
                el.on("button.internal.active", _.bind(doSetActiveState, me));
                el.on("mouseover", function (e) {
                    if (!me.disabled) {
                        me.cmpEl.addClass("over");
                        me.trigger("mouseover", me, e);
                    }
                });
                el.on("mouseout", function (e) {
                    if (!me.disabled) {
                        me.cmpEl.removeClass("over");
                        me.trigger("mouseout", me, e);
                    }
                });
                Common.UI.ToggleManager.register(me);
            }
            me.rendered = true;
            if (me.pressed) {
                me.toggle(me.pressed, true);
            }
            if (me.disabled) {
                me.setDisabled(me.disabled);
            }
            me.trigger("render:after", me);
            return this;
        },
        doToggle: function () {
            var me = this;
            if (me.enableToggle && (me.allowDepress !== false || !me.pressed)) {
                me.toggle();
            }
        },
        toggle: function (toggle, suppressEvent) {
            var state = toggle === undefined ? !this.pressed : !!toggle;
            this.pressed = state;
            if (this.cmpEl) {
                this.cmpEl.trigger("button.internal.active", [state]);
            }
            if (!suppressEvent) {
                this.trigger("toggle", this, state);
            }
        },
        isActive: function () {
            if (this.enableToggle) {
                return this.pressed;
            }
            return this.cmpEl.hasClass("active");
        },
        setDisabled: function (disabled) {
            if (this.rendered) {
                var el = this.cmpEl,
                isGroup = el.hasClass("btn-group");
                disabled = (disabled === true);
                if (disabled !== el.hasClass("disabled")) {
                    var decorateBtn = function (button) {
                        button.toggleClass("disabled", disabled);
                        (disabled) ? button.attr({
                            disabled: disabled
                        }) : button.removeAttr("disabled");
                    };
                    decorateBtn(el);
                    isGroup && decorateBtn(el.children("button"));
                }
                if (disabled) {
                    var tip = this.cmpEl.data("bs.tooltip");
                    if (tip) {
                        tip.hide();
                    }
                }
            }
            this.disabled = disabled;
        },
        isDisabled: function () {
            return this.disabled;
        },
        setIconCls: function (cls) {
            var btnIconEl = $(this.el).find("span.btn-icon"),
            oldCls = this.iconCls;
            this.iconCls = cls;
            btnIconEl.removeClass(oldCls);
            btnIconEl.addClass(cls || "");
        },
        setVisible: function (visible) {
            this.cmpEl.toggleClass("hidden", !visible);
        },
        updateHint: function (hint) {
            this.options.hint = hint;
            var cmpEl = this.cmpEl,
            modalParents = cmpEl.closest(".asc-window");
            cmpEl.attr("data-toggle", "tooltip");
            cmpEl.tooltip("destroy").tooltip({
                title: hint,
                placement: this.options.hintAnchor || "cursor"
            });
            if (modalParents.length > 0) {
                cmpEl.data("bs.tooltip").tip().css("z-index", parseInt(modalParents.css("z-index")) + 10);
            }
        },
        setCaption: function (caption) {
            if (this.caption != caption) {
                this.caption = caption;
                if (this.rendered) {
                    var captionNode = this.cmpEl.find("button:first > .caption").andSelf().filter("button > .caption");
                    if (captionNode.length > 0) {
                        captionNode.text(caption);
                    } else {
                        this.cmpEl.find("button:first").andSelf().filter("button").text(caption);
                    }
                }
            }
        }
    });
});