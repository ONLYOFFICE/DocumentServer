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
    Common.UI.DataViewGroupModel = Backbone.Model.extend({
        defaults: function () {
            return {
                id: Common.UI.getId(),
                caption: ""
            };
        }
    });
    Common.UI.DataViewGroupStore = Backbone.Collection.extend({
        model: Common.UI.DataViewGroupModel
    });
    Common.UI.DataViewModel = Backbone.Model.extend({
        defaults: function () {
            return {
                id: Common.UI.getId(),
                selected: false,
                allowSelected: true,
                value: null
            };
        }
    });
    Common.UI.DataViewStore = Backbone.Collection.extend({
        model: Common.UI.DataViewModel
    });
    Common.UI.DataViewItem = Common.UI.BaseView.extend({
        options: {},
        template: _.template(['<div id="<%= id %>"><%= value %></div>'].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this;
            me.template = me.options.template || me.template;
            me.listenTo(me.model, "change", me.render);
            me.listenTo(me.model, "change:selected", me.onSelectChange);
            me.listenTo(me.model, "remove", me.remove);
        },
        render: function () {
            if (_.isUndefined(this.model.id)) {
                return this;
            }
            var el = $(this.el);
            el.html(this.template(this.model.toJSON()));
            el.toggleClass("selected", this.model.get("selected") && this.model.get("allowSelected"));
            el.off("click").on("click", _.bind(this.onClick, this));
            el.off("dblclick").on("dblclick", _.bind(this.onDblClick, this));
            if (!_.isUndefined(this.model.get("cls"))) {
                el.addClass(this.model.get("cls"));
            }
            this.trigger("change", this, this.model);
            return this;
        },
        remove: function () {
            this.stopListening(this.model);
            this.trigger("remove", this, this.model);
            Common.UI.BaseView.prototype.remove.call(this);
        },
        onClick: function (e) {
            this.trigger("click", this, this.model, e);
        },
        onDblClick: function (e) {
            this.trigger("dblclick", this, this.model, e);
        },
        onSelectChange: function (model, selected) {
            this.trigger("select", this, model, selected);
        }
    });
    Common.UI.DataView = Common.UI.BaseView.extend({
        options: {
            multiSelect: false,
            handleSelect: true,
            enableKeyEvents: true,
            keyMoveDirection: "both",
            restoreHeight: 0,
            emptyText: "",
            listenStoreEvents: true,
            allowScrollbar: true
        },
        template: _.template(['<div class="dataview inner" style="<%= style %>">', "<% _.each(groups, function(group) { %>", '<div class="grouped-data" id="<%= group.id %>">', '<div class="group-description">', "<span><b><%= group.caption %></b></span>", "</div>", '<div class="group-items-container">', "</div>", "</div>", "<% }); %>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this;
            me.template = me.options.template || me.template;
            me.store = me.options.store || new Common.UI.DataViewStore();
            me.groups = me.options.groups || null;
            me.itemTemplate = me.options.itemTemplate || null;
            me.multiSelect = me.options.multiSelect;
            me.handleSelect = me.options.handleSelect;
            me.parentMenu = me.options.parentMenu;
            me.enableKeyEvents = me.options.enableKeyEvents;
            me.style = me.options.style || "";
            me.emptyText = me.options.emptyText || "";
            me.listenStoreEvents = (me.options.listenStoreEvents !== undefined) ? me.options.listenStoreEvents : true;
            me.allowScrollbar = (me.options.allowScrollbar !== undefined) ? me.options.allowScrollbar : true;
            me.rendered = false;
            me.dataViewItems = [];
            if (me.options.keyMoveDirection == "vertical") {
                me.moveKeys = [Common.UI.Keys.UP, Common.UI.Keys.DOWN];
            } else {
                if (me.options.keyMoveDirection == "horizontal") {
                    me.moveKeys = [Common.UI.Keys.LEFT, Common.UI.Keys.RIGHT];
                } else {
                    me.moveKeys = [Common.UI.Keys.UP, Common.UI.Keys.DOWN, Common.UI.Keys.LEFT, Common.UI.Keys.RIGHT];
                }
            }
            if (me.options.el) {
                me.render();
            }
        },
        render: function (parentEl) {
            var me = this;
            this.trigger("render:before", this);
            this.cmpEl = $(this.el);
            if (parentEl) {
                this.setElement(parentEl, false);
                this.cmpEl = $(this.template({
                    groups: me.groups ? me.groups.toJSON() : null,
                    style: me.style
                }));
                parentEl.html(this.cmpEl);
            } else {
                this.cmpEl.html(this.template({
                    groups: me.groups ? me.groups.toJSON() : null,
                    style: me.style
                }));
            }
            if (!this.rendered) {
                if (this.listenStoreEvents) {
                    this.listenTo(this.store, "add", this.onAddItem);
                    this.listenTo(this.store, "reset", this.onResetItems);
                }
                this.onResetItems();
                if (this.parentMenu) {
                    this.cmpEl.closest("li").css("height", "100%");
                    this.cmpEl.css("height", "100%");
                    this.parentMenu.on("show:after", _.bind(this.alignPosition, this));
                }
                if (this.enableKeyEvents && this.parentMenu && this.handleSelect) {
                    this.parentMenu.on("show:after", function () {
                        me.showLastSelected();
                        Common.NotificationCenter.trigger("dataview:focus");
                    });
                    this.parentMenu.on("hide:after", function () {
                        Common.NotificationCenter.trigger("dataview:blur");
                    });
                }
            }
            if (_.isUndefined(this.scroller) && this.allowScrollbar) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el).find(".inner").andSelf().filter(".inner"),
                    useKeyboard: this.enableKeyEvents && !this.handleSelect,
                    minScrollbarLength: 40
                });
            }
            var modalParents = this.cmpEl.closest(".asc-window");
            if (modalParents.length > 0) {
                this.tipZIndex = parseInt(modalParents.css("z-index")) + 10;
            }
            this.rendered = true;
            this.cmpEl.on("click", function (e) {
                if (/dataview/.test(e.target.className)) {
                    return false;
                }
            });
            this.trigger("render:after", this);
            return this;
        },
        setStore: function (store) {
            if (store) {
                this.stopListening(this.store);
                this.store = store;
                if (this.listenStoreEvents) {
                    this.listenTo(this.store, "add", this.onAddItem);
                    this.listenTo(this.store, "reset", this.onResetItems);
                }
            }
        },
        selectRecord: function (record, suspendEvents) {
            if (!this.handleSelect) {
                return;
            }
            if (suspendEvents) {
                this.suspendEvents();
            }
            if (!this.multiSelect) {
                _.each(this.store.where({
                    selected: true
                }), function (rec) {
                    rec.set({
                        selected: false
                    });
                });
                if (record) {
                    record.set({
                        selected: true
                    });
                }
            } else {
                if (record) {
                    record.set({
                        selected: !record.get("selected")
                    });
                }
            }
            if (suspendEvents) {
                this.resumeEvents();
            }
        },
        selectByIndex: function (index, suspendEvents) {
            if (this.store.length > 0 && index > -1 && index < this.store.length) {
                this.selectRecord(this.store.at(index), suspendEvents);
            }
        },
        deselectAll: function (suspendEvents) {
            if (suspendEvents) {
                this.suspendEvents();
            }
            _.each(this.store.where({
                selected: true
            }), function (record) {
                record.set({
                    selected: false
                });
            });
            if (suspendEvents) {
                this.resumeEvents();
            }
        },
        getSelectedRec: function () {
            if (this.multiSelect) {
                var items = [];
                _.each(this.store.where({
                    selected: true
                }), function (rec) {
                    items.push(rec);
                });
                return items;
            }
            return this.store.where({
                selected: true
            });
        },
        onAddItem: function (record, index, opts) {
            var view = new Common.UI.DataViewItem({
                template: this.itemTemplate,
                model: record
            });
            if (view) {
                var innerEl = $(this.el).find(".inner").andSelf().filter(".inner");
                if (this.groups && this.groups.length > 0) {
                    var group = this.groups.findWhere({
                        id: record.get("group")
                    });
                    if (group) {
                        innerEl = innerEl.find("#" + group.id + " " + ".group-items-container");
                    }
                }
                if (innerEl) {
                    if (opts && opts.at == 0) {
                        innerEl.prepend(view.render().el);
                    } else {
                        innerEl.append(view.render().el);
                    }
                    innerEl.find(".empty-text").remove();
                    this.dataViewItems.push(view);
                    if (record.get("tip")) {
                        var view_el = $(view.el);
                        view_el.attr("data-toggle", "tooltip");
                        view_el.tooltip({
                            title: record.get("tip"),
                            placement: "cursor",
                            zIndex: this.tipZIndex
                        });
                    }
                    this.listenTo(view, "change", this.onChangeItem);
                    this.listenTo(view, "remove", this.onRemoveItem);
                    this.listenTo(view, "click", this.onClickItem);
                    this.listenTo(view, "dblclick", this.onDblClickItem);
                    this.listenTo(view, "select", this.onSelectItem);
                    if (!this.isSuspendEvents) {
                        this.trigger("item:add", this, view, record);
                    }
                }
            }
        },
        onResetItems: function () {
            $(this.el).html(this.template({
                groups: this.groups ? this.groups.toJSON() : null,
                style: this.style
            }));
            if (!_.isUndefined(this.scroller)) {
                this.scroller.destroy();
                delete this.scroller;
            }
            if (this.store.length < 1 && this.emptyText.length > 0) {
                $(this.el).find(".inner").andSelf().filter(".inner").append('<table class="empty-text"><tr><td>' + this.emptyText + "</td></tr></table>");
            }
            _.each(this.dataViewItems, function (item) {
                this.stopListening(item);
                item.stopListening(item.model);
            },
            this);
            this.dataViewItems = [];
            this.store.each(this.onAddItem, this);
            if (this.allowScrollbar) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el).find(".inner").andSelf().filter(".inner"),
                    useKeyboard: this.enableKeyEvents && !this.handleSelect,
                    minScrollbarLength: 40
                });
            }
            this.attachKeyEvents();
        },
        onChangeItem: function (view, record) {
            if (!this.isSuspendEvents) {
                this.trigger("item:change", this, view, record);
            }
        },
        onRemoveItem: function (view, record) {
            this.stopListening(view);
            view.stopListening();
            if (this.store.length < 1 && this.emptyText.length > 0) {
                var el = $(this.el).find(".inner").andSelf().filter(".inner");
                if (el.find(".empty-text").length <= 0) {
                    el.append('<table class="empty-text"><tr><td>' + this.emptyText + "</td></tr></table>");
                }
            }
            for (var i = 0; i < this.dataViewItems.length; i++) {
                if (_.isEqual(view, this.dataViewItems[i])) {
                    this.dataViewItems.splice(i, 1);
                    break;
                }
            }
            if (!this.isSuspendEvents) {
                this.trigger("item:remove", this, view, record);
            }
        },
        onClickItem: function (view, record, e) {
            if (this.disabled) {
                return;
            }
            window._event = e;
            this.selectRecord(record);
            this.lastSelectedRec = undefined;
            var tip = view.$el.data("bs.tooltip");
            if (tip) {
                tip.hide();
            }
            if (!this.isSuspendEvents) {
                this.trigger("item:click", this, view, record, e);
            }
        },
        onDblClickItem: function (view, record, e) {
            if (this.disabled) {
                return;
            }
            window._event = e;
            this.selectRecord(record);
            this.lastSelectedRec = undefined;
            if (!this.isSuspendEvents) {
                this.trigger("item:dblclick", this, view, record, e);
            }
        },
        onSelectItem: function (view, record, selected) {
            if (!this.isSuspendEvents) {
                this.trigger(selected ? "item:select": "item:deselect", this, view, record);
            }
        },
        scrollToRecord: function (record) {
            var innerEl = $(this.el).find(".inner");
            var inner_top = innerEl.offset().top;
            var div = innerEl.find("#" + record.get("id"));
            var div_top = div.offset().top;
            if (div_top < inner_top || div_top + div.height() > inner_top + innerEl.height()) {
                if (this.scroller && this.allowScrollbar) {
                    this.scroller.scrollTop(innerEl.scrollTop() + div_top - inner_top, 0);
                } else {
                    innerEl.scrollTop(innerEl.scrollTop() + div_top - inner_top);
                }
            }
        },
        onKeyDown: function (e, data) {
            if (this.disabled) {
                return;
            }
            if (data === undefined) {
                data = e;
            }
            if (_.indexOf(this.moveKeys, data.keyCode) > -1 || data.keyCode == Common.UI.Keys.RETURN) {
                data.preventDefault();
                data.stopPropagation();
                var rec = this.getSelectedRec()[0];
                if (this.lastSelectedRec === undefined) {
                    this.lastSelectedRec = rec;
                }
                if (data.keyCode == Common.UI.Keys.RETURN) {
                    this.lastSelectedRec = undefined;
                    this.trigger("item:click", this, this, rec, e);
                    this.trigger("item:select", this, this, rec, e);
                    this.trigger("entervalue", this, rec, e);
                } else {
                    var idx = _.indexOf(this.store.models, rec);
                    idx = (data.keyCode == Common.UI.Keys.UP || data.keyCode == Common.UI.Keys.LEFT) ? Math.max(0, idx - 1) : Math.min(this.store.length - 1, idx + 1);
                    rec = this.store.at(idx);
                    if (rec) {
                        this.selectRecord(rec);
                        this.scrollToRecord(rec);
                    }
                }
            }
        },
        attachKeyEvents: function () {
            if (this.enableKeyEvents && this.handleSelect) {
                var el = $(this.el).find(".inner").andSelf().filter(".inner");
                el.addClass("canfocused");
                el.attr("tabindex", "0");
                el.on((this.parentMenu) ? "dataview:keydown": "keydown", _.bind(this.onKeyDown, this));
            }
        },
        showLastSelected: function () {
            if (this.lastSelectedRec) {
                this.selectRecord(this.lastSelectedRec, true);
                this.scrollToRecord(this.lastSelectedRec);
                this.lastSelectedRec = undefined;
            }
        },
        setDisabled: function (disabled) {
            this.disabled = disabled;
            $(this.el).find(".inner").andSelf().filter(".inner").toggleClass("disabled", disabled);
        },
        isDisabled: function () {
            return this.disabled;
        },
        alignPosition: function () {
            var menuRoot = (this.parentMenu.cmpEl.attr("role") === "menu") ? this.parentMenu.cmpEl : this.parentMenu.cmpEl.find("[role=menu]"),
            innerEl = $(this.el).find(".inner").andSelf().filter(".inner"),
            docH = $(document).height(),
            menuH = menuRoot.outerHeight(),
            top = parseInt(menuRoot.css("top"));
            if (menuH > docH) {
                innerEl.css("max-height", (docH - parseInt(menuRoot.css("padding-top")) - parseInt(menuRoot.css("padding-bottom")) - 5) + "px");
                if (this.allowScrollbar) {
                    this.scroller.update({
                        minScrollbarLength: 40
                    });
                }
            } else {
                if (innerEl.height() < this.options.restoreHeight) {
                    innerEl.css("max-height", (Math.min(docH - parseInt(menuRoot.css("padding-top")) - parseInt(menuRoot.css("padding-bottom")) - 5, this.options.restoreHeight)) + "px");
                    menuH = menuRoot.outerHeight();
                    if (top + menuH > docH) {
                        menuRoot.css("top", 0);
                    }
                    if (this.allowScrollbar) {
                        this.scroller.update({
                            minScrollbarLength: 40
                        });
                    }
                }
            }
        }
    });
    $(document).on("keydown.bs.dropdown.data-api", "[data-toggle=dropdown], [role=menu]", function (e) {
        if (e.keyCode !== Common.UI.Keys.UP && e.keyCode !== Common.UI.Keys.DOWN && e.keyCode !== Common.UI.Keys.LEFT && e.keyCode !== Common.UI.Keys.RIGHT && e.keyCode !== Common.UI.Keys.RETURN) {
            return;
        }
        _.defer(function () {
            var target = $(e.target).closest(".dropdown-toggle");
            target.parent().find(".inner.canfocused").trigger("dataview:keydown", e);
        },
        100);
    });
});