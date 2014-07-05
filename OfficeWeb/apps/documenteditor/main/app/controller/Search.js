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
 Ext.define("DE.controller.Search", {
    extend: "Ext.app.Controller",
    refs: [{
        ref: "searchDialog",
        selector: "commonsearchdialog"
    },
    {
        ref: "searchQuery",
        selector: "#search-dialog-text-search"
    },
    {
        ref: "replaceQuery",
        selector: "#search-dialog-text-replace"
    }],
    init: function () {
        this.control({
            "demainmenu #id-menu-search": {
                toggle: this._showSearchDialog
            },
            "commonsearchdialog": {
                show: function (obj) {
                    this.setDefaultView();
                    this.api.asc_selectSearchingResults(obj.getSettings().highlight);
                },
                hide: function () {
                    this.api.asc_selectSearchingResults(false);
                    this.api.asc_searchEnabled(false);
                }
            },
            "commonsearchdialog  button[group=search-text]": {
                click: function (btn) {
                    this._startSearch(btn.direction);
                }
            },
            "commonsearchdialog  button[group=replace-text]": {
                click: this.btnReplaceText
            },
            "#search-dialog-text-search": {
                searchstart: function (obj, text) {
                    this._startSearch("next");
                    obj.stopSearch(true);
                }
            },
            "commonsearchdialog checkbox[action=highlight]": {
                change: function (obj, newValue, oldValue) {
                    this.api.asc_selectSearchingResults(newValue);
                }
            }
        });
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onReplaceAll", Ext.bind(this._onReplaceText, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
    },
    setMode: function (mode) {
        this.mode = mode;
        if (this._frmSearch) {
            this._frmSearch.setViewMode(!this.mode.isEdit);
        }
    },
    setDefaultView: function () {
        this.getSearchDialog().searchMode();
    },
    _showSearchDialog: function (btn, pressed) {
        var mainmenu = Ext.getCmp("view-main-menu");
        if (pressed) {
            mainmenu.closeFullScaleMenu();
            var me = this;
            if (!me._frmSearch) {
                me._frmSearch = Ext.create("Common.view.SearchDialog", {
                    animateTarget: "id-menu-search",
                    closeAction: "hide",
                    wholewords: false,
                    highlight: {
                        checked: true
                    },
                    isViewMode: !this.mode.isEdit
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
    btnReplaceText: function (btn, event, opts) {
        var me = this;
        if (me.getSearchQuery().isValueValid()) {
            var sett = this.getSearchDialog().getSettings();
            if (btn.type == "all") {
                this.api.asc_replaceText(sett.textsearch, sett.textreplace, true, sett.casesensitive, sett.wholewords);
            } else {
                if (!this.api.asc_replaceText(sett.textsearch, sett.textreplace, false, sett.casesensitive, sett.wholewords)) {
                    this.showWarning(this.textNoTextFound);
                }
            }
        }
    },
    _startSearch: function (direction) {
        if (this.getSearchQuery().isValueValid()) {
            var sett = this.getSearchDialog().getSettings();
            if (!this.api.asc_findText(sett.textsearch, direction == "next", sett.casesensitive, sett.wholewords)) {
                this.showWarning(this.textNoTextFound);
            }
        }
    },
    showWarning: function (text) {
        var me = this;
        if (!this.msgbox) {
            this.msgbox = Ext.create("Ext.window.MessageBox", {
                listeners: {
                    beforehide: function () {
                        me.getSearchQuery().focus(true, 100);
                    }
                }
            });
        }
        var config = {
            title: this.textSearch,
            msg: text,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        };
        if (Common.userAgent.isIE) {
            var oldFn = {
                enter: Ext.FocusManager.navigateIn,
                esc: Ext.FocusManager.navigateOut
            };
            Ext.FocusManager.navigateIn = Ext.emptyFn;
            Ext.FocusManager.navigateOut = function (event) {
                me.msgbox.close();
            };
            config.fn = function (btn) {
                Ext.FocusManager.navigateIn = oldFn.enter;
                Ext.FocusManager.navigateOut = oldFn.esc;
            };
        }
        this.msgbox.show(config);
    },
    _onReplaceText: function (found, replaced) {
        var me = this;
        if (found) {
            if (! (found - replaced)) {
                me.showWarning(Ext.String.format(this.textReplaceSuccess, replaced));
            } else {
                me.showWarning(Ext.String.format(this.textReplaceSkipped, found - replaced));
            }
        } else {
            me.showWarning(me.textNoTextFound);
        }
    },
    onCoAuthoringDisconnect: function () {
        this.mode.isEdit = false;
        this._frmSearch && this._frmSearch.setViewMode(true);
    },
    textSearch: "Search",
    textNoTextFound: "Text not found",
    textReplaceSuccess: "Search has been done. {0} occurrences have been replaced",
    textReplaceSkipped: "The replacement has been made. {0} occurrences were skipped."
});