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
 Ext.define("PE.controller.Search", {
    extend: "Ext.app.Controller",
    refs: [{
        ref: "searchQuery",
        selector: "#search-dialog-text-search"
    },
    {
        ref: "searchDialog",
        selector: "commonsearchdialog"
    }],
    init: function () {
        var me = this;
        this.control({
            "pemainmenu #main-menu-search": {
                toggle: this._showSearchDialog
            },
            "commonsearchdialog  button[group=search-text]": {
                click: function (btn) {
                    this._startSearch(btn.direction);
                }
            },
            "#search-dialog-text-search": {
                searchstart: function (obj, text) {
                    this._startSearch("next");
                    obj.stopSearch(true);
                }
            }
        });
    },
    setApi: function (o) {
        this.api = o;
    },
    setMode: function (mode) {
        this.mode = mode;
        if (this._frmSearch) {
            this._frmSearch.setViewMode(!this.mode.isEdit);
        }
    },
    _startSearch: function (direction) {
        if (this.api && this.getSearchQuery().isValueValid()) {
            var sett = this.getSearchDialog().getSettings();
            if (!this.api.findText(sett.textsearch, direction == "next")) {
                Ext.Msg.alert(this.textSearch, this.textNoTextFound);
            }
        }
    },
    _showSearchDialog: function (btn, pressed) {
        var mainmenu = Ext.getCmp("view-main-menu");
        if (pressed) {
            mainmenu.closeFullScaleMenu();
            var me = this;
            if (!me._frmSearch) {
                me._frmSearch = Ext.create("Common.view.SearchDialog", {
                    animateTarget: "main-menu-search",
                    closeAction: "hide",
                    simplesearch: true,
                    isViewMode: true
                });
                me._frmSearch.addListener("hide", function (cnt, eOpts) {
                    if (!btn.ownrise) {
                        btn.ownrise = true;
                        btn.toggle(false);
                        if (!Ext.isDefined(mainmenu.currentFullScaleMenuBtn)) {
                            mainmenu.fireEvent("editcomplete", mainmenu);
                        }
                    }
                    btn.ownrise = false;
                });
            }
            me._frmSearch.show();
        } else {
            if (this._frmSearch && !btn.ownrise) {
                btn.ownrise = true;
                this._frmSearch.hide();
                if (!Ext.isDefined(mainmenu.currentFullScaleMenuBtn)) {
                    mainmenu.fireEvent("editcomplete", mainmenu);
                }
            }
        }
    },
    textSearch: "Search",
    textNoTextFound: "Text not found"
});