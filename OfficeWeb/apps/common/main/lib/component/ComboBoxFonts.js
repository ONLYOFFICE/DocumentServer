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
var FONT_TYPE_RECENT = 4;
define(["common/main/lib/component/ComboBox"], function () {
    Common.UI.ComboBoxFonts = Common.UI.ComboBox.extend((function () {
        var iconWidth = 302,
        iconHeight = FONT_THUMBNAIL_HEIGHT || 26,
        isRetina = window.devicePixelRatio > 1,
        thumbCanvas = document.createElement("canvas"),
        thumbContext = thumbCanvas.getContext("2d"),
        thumbPath = "../../../sdk/Common/Images/fonts_thumbnail.png",
        thumbPath2x = "../../../sdk/Common/Images/fonts_thumbnail@2x.png";
        thumbCanvas.height = isRetina ? iconHeight * 2 : iconHeight;
        thumbCanvas.width = isRetina ? iconWidth * 2 : iconWidth;
        return {
            template: _.template(['<div class="input-group combobox fonts <%= cls %>" id="<%= id %>" style="<%= style %>">', '<input type="text" class="form-control">', '<div style="display: table-cell;"></div>', '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>', '<ul class="dropdown-menu <%= menuCls %>" style="<%= menuStyle %>" role="menu">', '<li class="divider">', "<% _.each(items, function(item) { %>", '<li id="<%= item.id %>">', '<a class="font-item" tabindex="-1" type="menuitem" style="display: block;">', '<img src="<%= scope.getImageUri(item) %>" width="<%= scope.getImageWidth() %>" height="<%= scope.getImageHeight() %>" style="vertical-align: middle;margin: 0 0 0 -10px;">', "</a>", "</li>", "<% }); %>", "</ul>", "</div>"].join("")),
            initialize: function (options) {
                Common.UI.ComboBox.prototype.initialize.call(this, _.extend(options, {
                    displayField: "name"
                }));
                this.recent = _.isNumber(options.recent) ? options.recent : 3;
                Common.NotificationCenter.on("fonts:change", _.bind(this.onApiChangeFont, this));
                Common.NotificationCenter.on("fonts:load", _.bind(this.fillFonts, this));
            },
            render: function (parentEl) {
                var oldRawValue = null;
                if (!_.isUndefined(this._input)) {
                    oldRawValue = this._input.val();
                }
                Common.UI.ComboBox.prototype.render.call(this, parentEl);
                this.setRawValue(oldRawValue);
                this._input.on("keyup", _.bind(this.onInputKeyUp, this));
                this._input.on("keydown", _.bind(this.onInputKeyDown, this));
                this.scroller.update({
                    alwaysVisibleY: true
                });
                return this;
            },
            onInputKeyUp: function (e) {
                if (e.keyCode != Common.UI.Keys.RETURN) {
                    this.selectCandidate();
                }
            },
            onInputKeyDown: function (e) {
                var me = this;
                if (e.keyCode == Common.UI.Keys.ESC) {
                    this.closeMenu();
                    this.onAfterHideMenu(e);
                } else {
                    if (e.keyCode != Common.UI.Keys.RETURN && e.keyCode != Common.UI.Keys.CTRL && e.keyCode != Common.UI.Keys.SHIFT && e.keyCode != Common.UI.Keys.ALT) {
                        if (!this.isMenuOpen()) {
                            this.openMenu();
                        }
                        if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN) {
                            _.delay(function () {
                                var selected = me.cmpEl.find("ul li.selected a");
                                if (selected.length <= 0) {
                                    selected = me.cmpEl.find("ul li:first a");
                                }
                                me._skipInputChange = true;
                                selected.focus();
                            },
                            10);
                        } else {
                            me._skipInputChange = false;
                        }
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
                if (this._isMouseDownMenu) {
                    this._isMouseDownMenu = false;
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
                if (this._selectedItem) {
                    record[this.valueField] = this._selectedItem.get(this.displayField);
                    this.setRawValue(record[this.valueField]);
                    this.trigger("selected", this, _.extend({},
                    this._selectedItem.toJSON()), e);
                    this.closeMenu();
                }
                this.trigger("changed:after", this, record, e);
            },
            getImageUri: function (opts) {
                if (opts.cloneid) {
                    var img = $(this.el).find("ul > li#" + opts.cloneid + " img");
                    return img != null ? img[0].src : undefined;
                }
                if (isRetina) {
                    thumbContext.clearRect(0, 0, iconWidth * 2, iconHeight * 2);
                    thumbContext.drawImage(this.spriteThumbs, 0, -FONT_THUMBNAIL_HEIGHT * 2 * opts.imgidx);
                } else {
                    thumbContext.clearRect(0, 0, iconWidth, iconHeight);
                    thumbContext.drawImage(this.spriteThumbs, 0, -FONT_THUMBNAIL_HEIGHT * opts.imgidx);
                }
                return thumbCanvas.toDataURL();
            },
            getImageWidth: function () {
                return iconWidth;
            },
            getImageHeight: function () {
                return iconHeight;
            },
            loadSprite: function (callback) {
                if (callback) {
                    this.spriteThumbs = new Image();
                    this.spriteThumbs.onload = callback;
                    this.spriteThumbs.src = (window.devicePixelRatio > 1) ? thumbPath2x : thumbPath;
                }
            },
            fillFonts: function (store, select) {
                var me = this;
                this.loadSprite(function () {
                    me.store.set(store.toJSON());
                    me.rendered = false;
                    me.render($(me.el));
                    me._fontsArray = me.store.toJSON();
                    if (me.recent > 0) {
                        me.store.on("add", me.onInsertItem, me);
                        me.store.on("remove", me.onRemoveItem, me);
                    }
                });
            },
            onApiChangeFont: function (font) {
                var name = (_.isFunction(font.get_Name) ? font.get_Name() : font.asc_getName());
                if (this.getRawValue() !== name) {
                    var record = this.store.findWhere({
                        name: name
                    });
                    $(".selected", $(this.el)).removeClass("selected");
                    if (record) {
                        this.setRawValue(record.get(this.displayField));
                        var itemNode = $("#" + record.get("id"), $(this.el)),
                        menuNode = $("ul.dropdown-menu", this.cmpEl);
                        if (itemNode && menuNode) {
                            itemNode.addClass("selected");
                            if (this.recent <= 0) {
                                menuNode.scrollTop(itemNode.offset().top - menuNode.offset().top);
                            }
                        }
                    } else {
                        this.setRawValue(name);
                    }
                }
            },
            itemClicked: function (e) {
                var el = $(e.target).closest("li");
                var record = this.store.findWhere({
                    id: el.attr("id")
                });
                if (record.get("type") != FONT_TYPE_RECENT && !this.store.findWhere({
                    name: record.get("name"),
                    type: FONT_TYPE_RECENT
                })) {
                    var fonts = this.store.where({
                        type: FONT_TYPE_RECENT
                    });
                    if (! (fonts.length < this.recent)) {
                        this.store.remove(fonts[0]);
                    }
                    var new_record = record.clone();
                    new_record.set({
                        "type": FONT_TYPE_RECENT,
                        "id": Common.UI.getId(),
                        cloneid: record.id
                    });
                    this.store.add(new_record);
                }
                Common.UI.ComboBox.prototype.itemClicked.apply(this, arguments);
            },
            onInsertItem: function (item) {
                $(this.el).find("ul").prepend(_.template(['<li id="<%= item.id %>">', '<a class="font-item" tabindex="-1" type="menuitem" style="display: block;">', '<img src="<%= scope.getImageUri(item) %>" width="<%= scope.getImageWidth() %>" height="<%= scope.getImageHeight() %>" style="vertical-align: middle;margin: 0 0 0 -10px;">', "</a>", "</li>"].join(""), {
                    item: item.attributes,
                    scope: this
                }));
            },
            onRemoveItem: function (item, store, opts) {
                $(this.el).find("ul > li#" + item.id).remove();
            },
            onAfterShowMenu: function (e) {
                if (this.recent > 0) {
                    if (this.scroller && !this._scrollerIsInited) {
                        this.scroller.update();
                        this._scrollerIsInited = true;
                    }
                    $(this.el).find("ul").scrollTop(0);
                    this.trigger("show:after", this, e);
                } else {
                    Common.UI.ComboBox.prototype.onAfterShowMenu.apply(this, arguments);
                }
            },
            selectCandidate: function () {
                var me = this,
                inputVal = this._input.val().toLowerCase();
                if (!this._fontsArray) {
                    this._fontsArray = this.store.toJSON();
                }
                var font = _.find(this._fontsArray, function (font) {
                    return (font[me.displayField].toLowerCase().indexOf(inputVal) == 0);
                });
                if (font) {
                    this._selectedItem = this.store.findWhere({
                        id: font.id
                    });
                }
                $(".selected", $(this.el)).removeClass("selected");
                if (this._selectedItem) {
                    var itemNode = $("#" + this._selectedItem.get("id"), $(this.el)),
                    menuEl = $("ul[role=menu]", $(this.el));
                    if (itemNode.length > 0 && menuEl.length > 0) {
                        itemNode.addClass("selected");
                        var itemTop = itemNode.position().top,
                        menuTop = menuEl.scrollTop();
                        if (itemTop != 0) {
                            menuEl.scrollTop(menuTop + itemTop);
                        }
                    }
                }
            }
        };
    })());
});