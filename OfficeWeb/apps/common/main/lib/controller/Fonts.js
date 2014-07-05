/*
 * (c) Copyright Ascensio System SIA 2010-2014
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
 var FONT_TYPE_USERUSED = 4;
Ext.define("Common.controller.Fonts", {
    extend: "Ext.app.Controller",
    views: ["ComboFonts"],
    refs: [{
        ref: "combo",
        selector: "commoncombofonts"
    }],
    stores: ["Common.store.Fonts"],
    init: function () {
        this.control({
            "commoncombofonts": {
                expand: function (picker) {
                    var combo = this.getCombo();
                    var plugin = combo.getPlugin("scrollpane");
                    if (plugin) {
                        var doScroll = new Ext.util.DelayedTask(function () {
                            var node = combo.picker.getNode(combo.lastSelection[0]);
                            if (node) {
                                plugin.scrollToElement(node, false, false);
                            }
                        });
                    }
                    doScroll.delay(10);
                },
                select: this._selectitem
            }
        });
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onInitEditorFonts", Ext.bind(this._onloadfonts, this));
        this.api.asc_registerCallback("asc_onFontFamily", Ext.bind(this._onfontchange, this));
    },
    _isfontsaved: function (s, r) {
        var out = r.get("type") == FONT_TYPE_USERUSED,
        i = -1,
        c = s.getCount(),
        su,
        n = r.get("name");
        while (!out && ++i < c) {
            su = s.getAt(i);
            if (su.get("type") != FONT_TYPE_USERUSED) {
                break;
            }
            out = su.get("name") == n;
        }
        return out;
    },
    _selectitem: function (combo, records, eOpts) {
        if (combo.showlastused && !this._isfontsaved(combo.getStore(), records[0])) {
            var node = combo.picker.getNode(records[0]);
            var data = records[0].data;
            var font = {
                id: data.id,
                name: data.name,
                imgidx: data.imgidx,
                cloneid: node.querySelector("img").id,
                type: FONT_TYPE_USERUSED
            };
            combo.getStore().insert(0, [font]);
            var separator = combo.picker.getEl().down(".used-fonts-separator");
            if (!separator) {
                separator = document.createElement("div");
                separator.setAttribute("class", "x-menu-item-separator used-fonts-separator");
                separator.setAttribute("style", "padding:0 10px;margin-left: 10px;");
                node = combo.picker.getNode(combo.getStore().getAt(1));
                node.parentNode.insertBefore(separator, node);
            }
            font = combo.getStore().getAt(5);
            if (font.data.type == FONT_TYPE_USERUSED) {
                combo.getStore().remove(font);
            } else {
                var plugin = combo.getPlugin("scrollpane");
                if (plugin) {
                    plugin.updateScrollPane();
                }
            }
        }
    },
    _onfontchange: function (fontobj) {
        var combo = this.getCombo();
        var name = fontobj.get_Name();
        var rec = combo.store.findRecord("name", name, 0, false, false, true);
        combo.clearValue();
        if (rec) {
            combo.select(rec);
        } else {
            combo.setRawValue(name);
        }
    },
    _onloadfonts: function (fl, select) {
        var farr = [];
        Ext.each(fl, function (item) {
            farr.push({
                id: item.asc_getFontId(),
                name: item.asc_getFontName(),
                imgidx: item.asc_getFontThumbnail(),
                type: item.asc_getFontType()
            });
        });
        var combo = this.getCombo();
        if (combo) {
            combo.fillFonts(farr, select);
        } else {
            this.fontscash = farr;
        }
        window.required_downloads--;
    },
    loadFonts: function (select) {
        if (this.api) {
            var fl = this.api.get_PropertyEditorFonts();
            if (fl) {
                this._onloadfonts(fl, select);
            }
        }
    },
    fillFonts: function (select) {
        var combo = this.getCombo();
        if (combo && combo.rendered && this.fontscash) {
            combo.fillFonts(this.fontscash, select);
            delete this.fontscash;
        }
    }
});