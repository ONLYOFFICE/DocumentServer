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
 Ext.define("SSE.controller.Search", {
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
        var me = this;
        this.control({
            "commonsearchdialog": {
                show: function () {
                    me.api.asc_closeCellEditor();
                    me.setDefaultView();
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
            "ssemainmenu #main-menu-search": {
                toggle: this.showSearchDialog
            }
        });
    },
    setMode: function (mode) {
        this.mode = mode;
        this._frmSearch && this._frmSearch.setViewMode(!this.mode.isEdit);
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onRenameCellTextEnd", Ext.bind(this._onRenameText, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
    },
    setDefaultView: function () {
        this.getSearchDialog().searchMode();
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
    btnReplaceText: function (btn, event, opts) {
        var me = this;
        if (me.getSearchQuery().isValueValid()) {
            var sett = this.getSearchDialog().getSettings();
            this.api.isReplaceAll = (btn.type == "all");
            this.api.asc_replaceText(sett.textsearch, sett.textreplace, btn.type == "all", sett.casesensitive, sett.wholewords);
        }
    },
    _startSearch: function (direction) {
        if (this.api && this.getSearchQuery().isValueValid()) {
            var sett = this.getSearchDialog().getSettings();
            if (!this.api.asc_findText(sett.textsearch, true, direction == "next", sett.casesensitive, sett.wholewords)) {
                this.showWarning(this.textNoTextFound);
            }
        }
    },
    _onRenameText: function (found, replaced) {
        var me = this;
        if (this.api.isReplaceAll) {
            if (found) {
                if (! (found - replaced)) {
                    me.showWarning(Ext.String.format(this.textReplaceSuccess, replaced));
                } else {
                    me.showWarning(Ext.String.format(this.textReplaceSkipped, found - replaced));
                }
            } else {
                me.showWarning(me.textNoTextFound);
            }
        } else {
            var sett = this.getSearchDialog().getSettings();
            if (!me.api.asc_findText(sett.textsearch, true, true, sett.casesensitive, sett.wholewords)) {
                me.showWarning(me.textNoTextFound);
            }
        }
    },
    showSearchDialog: function (btn, pressed) {
        if (pressed) {
            var mainmenu = btn.up("#view-main-menu");
            mainmenu.closeFullScaleMenu();
            var me = this;
            if (!me._frmSearch) {
                me._frmSearch = Ext.create("Common.view.SearchDialog", {
                    animateTarget: "main-menu-search",
                    closeAction: "hide",
                    isViewMode: !me.mode.isEdit,
                    highlight: false,
                    listeners: {
                        hide: function (cnt, eOpts) {
                            if (!btn.ownrise) {
                                btn.ownrise = true;
                                btn.toggle(false, true);
                                mainmenu.fireEvent("editcomplete", mainmenu);
                            }
                            btn.ownrise = false;
                        }
                    }
                });
            }
            me._frmSearch.show();
        } else {
            if (this._frmSearch && !btn.ownrise) {
                btn.ownrise = true;
                this._frmSearch.hide();
            }
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