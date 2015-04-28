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
define(["common/main/lib/component/BaseView", "common/main/lib/component/Scroller"], function () {
    Common.UI.ComboBoxModel = Backbone.Model.extend({
        defaults: function () {
            return {
                id: Common.UI.getId(),
                value: null,
                displayValue: null
            };
        }
    });
    Common.UI.ComboBoxStore = Backbone.Collection.extend({
        model: Common.UI.ComboBoxModel
    });
    Common.UI.ComboBox = Common.UI.BaseView.extend((function () {
        return {
            options: {
                id: null,
                cls: "",
                style: "",
                hint: false,
                editable: true,
                disabled: false,
                menuCls: "",
                menuStyle: "",
                displayField: "displayValue",
                valueField: "value"
            },
            template: _.template(['<span class="input-group combobox <%= cls %>" id="<%= id %>" style="<%= style %>">', '<input type="text" class="form-control">', '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>', '<ul class="dropdown-menu <%= menuCls %>" style="<%= menuStyle %>" role="menu">', "<% _.each(items, function(item) { %>", '<li id="<%= item.id %>" data-value="<%= item.value %>"><a tabindex="-1" type="menuitem"><%= scope.getDisplayValue(item) %></a></li>', "<% }); %>", "</ul>", "</span>"].join("")),
            initialize: function (options) {
                Common.UI.BaseView.prototype.initialize.call(this, options);
                var me = this,
                el = $(this.el);
                this.id = me.options.id || Common.UI.getId();
                this.cls = me.options.cls;
                this.style = me.options.style;
                this.menuCls = me.options.menuCls;
                this.menuStyle = me.options.menuStyle;
                this.template = me.options.template || me.template;
                this.hint = me.options.hint;
                this.editable = me.options.editable;
                this.disabled = me.options.disabled;
                this.store = me.options.store || new Common.UI.ComboBoxStore();
                this.displayField = me.options.displayField;
                this.valueField = me.options.valueField;
                me.rendered = me.options.rendered || false;
                this.lastValue = null;
                me.store.add(me.options.data);
                if (me.options.el) {
                    me.render();
                }
            },
            render: function (parentEl) {
                var me = this;
                if (!me.rendered) {
                    this.cmpEl = $(this.template({
                        id: this.id,
                        cls: this.cls,
                        style: this.style,
                        menuCls: this.menuCls,
                        menuStyle: this.menuStyle,
                        items: this.store.toJSON(),
                        scope: me
                    }));
                    if (parentEl) {
                        this.setElement(parentEl, false);
                        parentEl.html(this.cmpEl);
                    } else {
                        $(this.el).html(this.cmpEl);
                    }
                } else {
                    this.cmpEl = $(this.el);
                }
                if (!me.rendered) {
                    var el = this.cmpEl;
                    this._input = el.find("input");
                    this._button = el.find(".btn");
                    el.on("click", "a", _.bind(this.itemClicked, this));
                    el.on("mousedown", "a", _.bind(this.itemMouseDown, this));
                    if (this.editable) {
                        el.on("change", "input", _.bind(this.onInputChanged, this));
                        el.on("keydown", "input", _.bind(this.onInputKeyDown, this));
                        el.on("click", ".form-control", _.bind(this.onEditableInputClick, this));
                    } else {
                        el.on("click", ".form-control", _.bind(this.onInputClick, this));
                        this._input.attr("readonly", "readonly");
                        this._input.attr("data-can-copy", false);
                    }
                    if (me.options.hint) {
                        el.attr("data-toggle", "tooltip");
                        el.tooltip({
                            title: me.options.hint,
                            placement: me.options.hintAnchor || "cursor"
                        });
                    }
                    el.on("show.bs.dropdown", _.bind(me.onBeforeShowMenu, me));
                    el.on("shown.bs.dropdown", _.bind(me.onAfterShowMenu, me));
                    el.on("hide.bs.dropdown", _.bind(me.onBeforeHideMenu, me));
                    el.on("hidden.bs.dropdown", _.bind(me.onAfterHideMenu, me));
                    el.on("keydown.after.bs.dropdown", _.bind(me.onAfterKeydownMenu, me));
                    Common.NotificationCenter.on("menumanager:hideall", _.bind(me.closeMenu, me));
                    this.scroller = new Common.UI.Scroller({
                        el: $(".dropdown-menu", me.cmpEl),
                        minScrollbarLength: 40,
                        scrollYMarginOffset: 30,
                        includePadding: true
                    });
                    this.setDefaultSelection();
                    this.listenTo(this.store, "reset", this.onResetItems);
                }
                me.rendered = true;
                if (me.disabled) {
                    me.setDisabled(me.disabled);
                }
                return this;
            },
            setData: function (data) {
                this.store.reset([]);
                this.store.add(data);
                this.setRawValue("");
                this.onResetItems();
            },
            openMenu: function (delay) {
                var me = this;
                _.delay(function () {
                    me.cmpEl.addClass("open");
                },
                delay || 0);
            },
            closeMenu: function () {
                this.cmpEl.removeClass("open");
            },
            isMenuOpen: function () {
                return this.cmpEl.hasClass("open");
            },
            onBeforeShowMenu: function (e) {
                this.trigger("show:before", this, e);
                if (this.options.hint) {
                    var tip = this.cmpEl.data("bs.tooltip");
                    if (tip) {
                        if (tip.dontShow === undefined) {
                            tip.dontShow = true;
                        }
                        tip.hide();
                    }
                }
            },
            onAfterShowMenu: function (e) {
                var $list = $(this.el).find("ul"),
                $selected = $list.find("> li.selected");
                if ($selected.length) {
                    var itemTop = $selected.position().top,
                    itemHeight = $selected.height(),
                    listHeight = $list.height();
                    if (itemTop < 0 || itemTop + itemHeight > listHeight) {
                        $list.scrollTop($list.scrollTop() + itemTop + itemHeight - (listHeight / 2));
                    }
                }
                if (this.scroller) {
                    this.scroller.update();
                }
                this.trigger("show:after", this, e);
            },
            onBeforeHideMenu: function (e) {
                this.trigger("hide:before", this, e);
                if (Common.UI.Scroller.isMouseCapture()) {
                    e.preventDefault();
                }
            },
            onAfterHideMenu: function (e) {
                this.cmpEl.find(".dropdown-toggle").blur();
                this.trigger("hide:after", this, e);
            },
            onAfterKeydownMenu: function (e) {
                if (e.keyCode == Common.UI.Keys.RETURN) {
                    $(e.target).click();
                    var me = this;
                    if (this.rendered) {
                        if (Common.Utils.isIE) {
                            this._input.trigger("change", {
                                onkeydown: true
                            });
                        } else {
                            this._input.blur();
                        }
                    }
                    return false;
                } else {
                    if (e.keyCode == Common.UI.Keys.ESC && this.isMenuOpen()) {
                        this.closeMenu();
                        this.onAfterHideMenu(e);
                        return false;
                    }
                }
            },
            onInputKeyDown: function (e) {
                var me = this;
                if (e.keyCode == Common.UI.Keys.ESC) {
                    this.closeMenu();
                    this.onAfterHideMenu(e);
                } else {
                    if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN) {
                        if (!this.isMenuOpen()) {
                            this.openMenu();
                        }
                        _.delay(function () {
                            me._skipInputChange = true;
                            me.cmpEl.find("ul li:first a").focus();
                        },
                        10);
                    } else {
                        me._skipInputChange = false;
                    }
                }
            },
            onInputChanged: function (e, extra) {
                if (extra && extra.synthetic) {
                    return;
                }
                if (this._skipInputChange) {
                    this._skipInputChange = false;
                    return;
                }
                var val = $(e.target).val(),
                record = {};
                if (this.lastValue === val) {
                    if (extra && extra.onkeydown) {
                        this.trigger("combo:blur", this, e);
                    }
                    return;
                }
                record[this.valueField] = val;
                this.trigger("changed:before", this, record, e);
                if (e.isDefaultPrevented()) {
                    return;
                }
                var obj;
                this._selectedItem = this.store.findWhere((obj = {},
                obj[this.displayField] = val, obj));
                if (this._selectedItem) {
                    record = this._selectedItem.toJSON();
                    $(".selected", $(this.el)).removeClass("selected");
                    $("#" + this._selectedItem.get("id"), $(this.el)).addClass("selected");
                }
                this.trigger("changed:after", this, record, e);
            },
            onInputClick: function (e) {
                if (this._button) {
                    this._button.dropdown("toggle");
                }
                e.preventDefault();
                e.stopPropagation();
            },
            onEditableInputClick: function (e) {
                if (this.options.hint) {
                    var tip = this.cmpEl.data("bs.tooltip");
                    if (tip) {
                        if (tip.dontShow === undefined) {
                            tip.dontShow = true;
                        }
                        tip.hide();
                    }
                }
                if (this.isMenuOpen() && e.which == 1) {
                    e.stopPropagation();
                }
            },
            setDefaultSelection: function () {
                if (!this.rendered) {
                    return;
                }
                var val = this._input.val(),
                obj;
                if (val) {
                    this._selectedItem = this.store.findWhere((obj = {},
                    obj[this.displayField] = val, obj));
                    if (this._selectedItem) {
                        $(".selected", $(this.el)).removeClass("selected");
                        $("#" + this._selectedItem.get("id"), $(this.el)).addClass("selected");
                    }
                }
            },
            setDisabled: function (disabled) {
                this.disabled = disabled;
                if (!this.rendered) {
                    return;
                }
                disabled ? this._input.attr("disabled", true) : this._input.removeAttr("disabled");
                this.cmpEl.toggleClass("disabled", disabled);
                this._button.toggleClass("disabled", disabled);
            },
            isDisabled: function () {
                return this.disabled;
            },
            setRawValue: function (value) {
                if (this.rendered) {
                    this._input.val(value).trigger("change", {
                        synthetic: true
                    });
                    this.lastValue = (value !== null && value !== undefined) ? value.toString() : value;
                }
            },
            getRawValue: function () {
                return this.rendered ? this._input.val() : null;
            },
            setValue: function (value) {
                if (!this.rendered) {
                    return;
                }
                var obj;
                this._selectedItem = this.store.findWhere((obj = {},
                obj[this.valueField] = value, obj));
                $(".selected", $(this.el)).removeClass("selected");
                if (this._selectedItem) {
                    this.setRawValue(this._selectedItem.get(this.displayField));
                    $("#" + this._selectedItem.get("id"), $(this.el)).addClass("selected");
                } else {
                    this.setRawValue(value);
                }
            },
            getValue: function () {
                if (!this.rendered) {
                    return null;
                }
                if (this._selectedItem && !_.isUndefined(this._selectedItem.get(this.valueField))) {
                    return this._selectedItem.get(this.valueField);
                }
                return this._input.val();
            },
            getDisplayValue: function (record) {
                return Common.Utils.String.htmlEncode(record[this.displayField]);
            },
            getSelectedRecord: function () {
                if (!this.rendered) {
                    return null;
                }
                if (this._selectedItem && !_.isUndefined(this._selectedItem.get(this.valueField))) {
                    return _.extend({},
                    this._selectedItem.toJSON());
                }
                return null;
            },
            selectRecord: function (record) {
                if (!this.rendered || !record) {
                    return;
                }
                this._selectedItem = record;
                $(".selected", $(this.el)).removeClass("selected");
                this.setRawValue(this._selectedItem.get(this.displayField));
                $("#" + this._selectedItem.get("id"), $(this.el)).addClass("selected");
            },
            itemClicked: function (e) {
                var el = $(e.target).closest("li");
                this._selectedItem = this.store.findWhere({
                    id: el.attr("id")
                });
                if (this._selectedItem) {
                    this.lastValue = this._selectedItem.get(this.displayField);
                    this._input.val(this.lastValue).trigger("change", {
                        synthetic: true
                    });
                    $(".selected", $(this.el)).removeClass("selected");
                    el.addClass("selected");
                    this.trigger("selected", this, _.extend({},
                    this._selectedItem.toJSON()), e);
                    e.preventDefault();
                }
                this._isMouseDownMenu = false;
            },
            itemMouseDown: function (e) {
                if (e.which != 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                this._isMouseDownMenu = true;
            },
            onResetItems: function () {
                $(this.el).find("ul").html(_.template(["<% _.each(items, function(item) { %>", '<li id="<%= item.id %>" data-value="<%= item.value %>"><a tabindex="-1" type="menuitem"><%= scope.getDisplayValue(item) %></a></li>', "<% }); %>"].join(""), {
                    items: this.store.toJSON(),
                    scope: this
                }));
                if (!_.isUndefined(this.scroller)) {
                    this.scroller.destroy();
                    delete this.scroller;
                }
                this.scroller = new Common.UI.Scroller({
                    el: $(".dropdown-menu", this.cmpEl),
                    minScrollbarLength: 40,
                    scrollYMarginOffset: 30,
                    includePadding: true
                });
            }
        };
    })());
});