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
    Common.UI.MenuItem = Common.UI.BaseView.extend({
        options: {
            id: null,
            cls: "",
            style: "",
            hint: false,
            checkable: false,
            checked: false,
            allowDepress: false,
            disabled: false,
            value: null,
            toggleGroup: null,
            iconCls: "",
            menu: null,
            canFocused: true
        },
        tagName: "li",
        template: _.template(['<a id="<%= id %>" style="<%= style %>" <% if(options.canFocused) { %> tabindex="-1" type="menuitem" <% }; if(!_.isUndefined(options.stopPropagation)) { %> data-stopPropagation="true" <% }; %> >', "<% if (!_.isEmpty(iconCls)) { %>", '<span class="menu-item-icon <%= iconCls %>"></span>', "<% } %>", "<%= caption %>", "</a>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            this.id = me.options.id || Common.UI.getId();
            this.cls = me.options.cls;
            this.style = me.options.style;
            this.caption = me.options.caption;
            this.menu = me.options.menu || null;
            this.checkable = me.options.checkable;
            this.checked = me.options.checked;
            me.allowDepress = me.options.allowDepress;
            this.disabled = me.options.disabled;
            this.value = me.options.value;
            this.toggleGroup = me.options.toggleGroup;
            this.template = me.options.template || this.template;
            this.iconCls = me.options.iconCls;
            this.rendered = false;
            if (this.menu !== null && !(this.menu instanceof Common.UI.Menu)) {
                this.menu = new Common.UI.Menu(_.extend({},
                me.options.menu));
            }
            if (me.options.el) {
                this.render();
            }
        },
        render: function () {
            var me = this,
            el = $(this.el);
            me.trigger("render:before", me);
            if (me.caption === "--") {
                el.addClass("divider");
            } else {
                if (!this.rendered) {
                    el.off("click");
                    Common.UI.ToggleManager.unregister(me);
                    $(this.el).html(this.template({
                        id: me.id,
                        caption: me.caption,
                        iconCls: me.iconCls,
                        style: me.style,
                        options: me.options
                    }));
                    if (me.menu) {
                        el.addClass("dropdown-submenu");
                        me.menu.render($(this.el));
                        el.mouseenter(_.bind(me.menu.alignPosition, me.menu));
                        el.focusout(_.bind(me.onBlurItem, me));
                        el.hover(_.bind(me.onHoverItem, me), _.bind(me.onUnHoverItem, me));
                    }
                    var firstChild = el.children(":first");
                    if (this.checkable && firstChild) {
                        firstChild.toggleClass("checkable", this.checkable);
                        firstChild.toggleClass("checked", this.checked);
                        if (!_.isEmpty(this.iconCls)) {
                            firstChild.css("background-image", "none");
                        }
                    }
                    if (this.disabled) {
                        $(this.el).toggleClass("disabled", this.disabled);
                    }
                    el.on("click", _.bind(this.onItemClick, this));
                    el.on("mousedown", _.bind(this.onItemMouseDown, this));
                    Common.UI.ToggleManager.register(me);
                }
            }
            me.cmpEl = $(this.el);
            me.rendered = true;
            me.trigger("render:after", me);
            return this;
        },
        setCaption: function (caption) {
            this.caption = caption;
            if (this.rendered) {
                this.cmpEl.find("a").contents().last()[0].textContent = Common.Utils.String.htmlEncode(caption);
            }
        },
        setChecked: function (check, suppressEvent) {
            this.toggle(check, suppressEvent);
        },
        isChecked: function () {
            return this.checked;
        },
        setDisabled: function (disabled) {
            this.disabled = !!disabled;
            if (this.rendered) {
                this.cmpEl.toggleClass("disabled", this.disabled);
            }
        },
        isDisabled: function () {
            return this.disabled;
        },
        toggle: function (toggle, suppressEvent) {
            var state = toggle === undefined ? !this.checked : !!toggle;
            if (this.checkable) {
                this.checked = state;
                if (this.rendered) {
                    var firstChild = this.cmpEl.children(":first");
                    if (firstChild) {
                        firstChild.toggleClass("checked", this.checked);
                        if (!_.isEmpty(this.iconCls)) {
                            firstChild.css("background-image", "none");
                        }
                    }
                }
                if (!suppressEvent) {
                    this.trigger("toggle", this, state);
                }
            }
        },
        onItemMouseDown: function (e) {
            if (e.which != 1) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
        onItemClick: function (e) {
            if (e.which != 1 && (e.which !== undefined || this.menu)) {
                return false;
            }
            if (!this.disabled && (this.allowDepress || !(this.checked && this.toggleGroup))) {
                this.setChecked(!this.checked);
            }
            if (this.menu) {
                if (e.target.id == this.id) {
                    return false;
                }
                if (!this.menu.isOver) {
                    this.cmpEl.removeClass("over");
                }
                return;
            }
            if (!this.disabled) {
                this.trigger("click", this, e);
            } else {
                return false;
            }
        },
        onHoverItem: function (e) {
            this._doHover(e);
        },
        onUnHoverItem: function (e) {
            this._doUnHover(e);
        },
        onBlurItem: function (e) {
            this._doUnHover(e);
        },
        _doHover: function (e) {
            var me = this;
            if (me.menu && !me.disabled) {
                clearTimeout(me.hideMenuTimer);
                me.cmpEl.trigger("show.bs.dropdown");
                me.expandMenuTimer = _.delay(function () {
                    me.cmpEl.addClass("over");
                    me.cmpEl.trigger("shown.bs.dropdown");
                },
                200);
            }
        },
        _doUnHover: function (e) {
            var me = this;
            if (me.menu && !me.disabled) {
                clearTimeout(me.expandMenuTimer);
                me.hideMenuTimer = _.delay(function () {
                    if (!me.menu.isOver) {
                        me.cmpEl.removeClass("over");
                    }
                },
                200);
            }
        }
    });
});