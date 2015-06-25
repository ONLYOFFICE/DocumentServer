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
 define(["core", "common/main/lib/util/Shortcuts", "spreadsheeteditor/main/app/view/LeftMenu", "spreadsheeteditor/main/app/view/FileMenu"], function () {
    SSE.Controllers.LeftMenu = Backbone.Controller.extend(_.extend({
        views: ["LeftMenu", "FileMenu"],
        initialize: function () {
            this.addListeners({
                "Common.Views.Chat": {
                    "hide": _.bind(this.onHideChat, this)
                },
                "Statusbar": {
                    "click:users": _.bind(this.clickStatusbarUsers, this)
                },
                "LeftMenu": {
                    "file:show": _.bind(this.fileShowHide, this, true),
                    "file:hide": _.bind(this.fileShowHide, this, false),
                    "comments:show": _.bind(this.commentsShowHide, this, true),
                    "comments:hide": _.bind(this.commentsShowHide, this, false),
                },
                "Common.Views.About": {
                    "show": _.bind(this.aboutShowHide, this, true),
                    "hide": _.bind(this.aboutShowHide, this, false)
                },
                "FileMenu": {
                    "item:click": _.bind(this.clickMenuFileItem, this),
                    "saveas:format": _.bind(this.clickSaveAsFormat, this),
                    "settings:apply": _.bind(this.applySettings, this),
                    "create:new": _.bind(this.onCreateNew, this),
                    "recent:open": _.bind(this.onOpenRecent, this)
                },
                "Toolbar": {
                    "file:settings": _.bind(this.clickToolbarSettings, this)
                },
                "SearchDialog": {
                    "hide": _.bind(this.onSearchDlgHide, this),
                    "search:back": _.bind(this.onQuerySearch, this, "back"),
                    "search:next": _.bind(this.onQuerySearch, this, "next"),
                    "search:replace": _.bind(this.onQueryReplace, this),
                    "search:replaceall": _.bind(this.onQueryReplaceAll, this)
                }
            });
        },
        onLaunch: function () {
            this.leftMenu = this.createView("LeftMenu").render();
            this.leftMenu.btnSearch.on("toggle", _.bind(this.onMenuSearch, this));
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: {
                    "command+shift+s,ctrl+shift+s": _.bind(this.onShortcut, this, "save"),
                    "command+f,ctrl+f": _.bind(this.onShortcut, this, "search"),
                    "command+h,ctrl+h": _.bind(this.onShortcut, this, "replace"),
                    "alt+f": _.bind(this.onShortcut, this, "file"),
                    "esc": _.bind(this.onShortcut, this, "escape"),
                    "ctrl+alt+q": _.bind(this.onShortcut, this, "chat"),
                    "command+shift+h,ctrl+shift+h": _.bind(this.onShortcut, this, "comments"),
                    "f1": _.bind(this.onShortcut, this, "help")
                }
            });
            Common.util.Shortcuts.suspendEvents();
            var me = this;
            this.leftMenu.$el.find("button").each(function () {
                $(this).on("keydown", function (e) {
                    if (Common.UI.Keys.RETURN === e.keyCode || Common.UI.Keys.SPACE === e.keyCode) {
                        me.leftMenu.btnFile.toggle(false);
                        me.leftMenu.btnAbout.toggle(false);
                        this.blur();
                        e.preventDefault();
                        me.api.asc_enableKeyEvents(true);
                    }
                });
            });
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onRenameCellTextEnd", _.bind(this.onRenameText, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiServerDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiServerDisconnect, this));
            if (this.mode.canCoAuthoring && this.mode.canChat) {
                this.api.asc_registerCallback("asc_onCoAuthoringChatReceiveMessage", _.bind(this.onApiChatMessage, this));
            }
            if (!this.mode.isEditDiagram) {
                this.api.asc_registerCallback("asc_onEditCell", _.bind(this.onApiEditCell, this));
            }
            this.leftMenu.getMenu("file").setApi(api);
            return this;
        },
        setMode: function (mode) {
            this.mode = mode;
            this.leftMenu.setMode(mode);
            this.leftMenu.getMenu("file").setMode(mode);
            return this;
        },
        createDelayedElements: function () {
            if (this.mode.canCoAuthoring) {
                this.leftMenu.btnComments[this.mode.isEdit && this.mode.canComments ? "show" : "hide"]();
                if (this.mode.canComments) {
                    this.leftMenu.setOptionsPanel("comment", this.getApplication().getController("Common.Controllers.Comments").getView("Common.Views.Comments"));
                }
                this.leftMenu.btnChat[this.mode.canChat ? "show" : "hide"]();
                if (this.mode.canChat) {
                    this.leftMenu.setOptionsPanel("chat", this.getApplication().getController("Common.Controllers.Chat").getView("Common.Views.Chat"));
                }
            } else {
                this.leftMenu.btnChat.hide();
                this.leftMenu.btnComments.hide();
            }
            Common.util.Shortcuts.resumeEvents();
            if (!this.mode.isEditDiagram) {
                Common.NotificationCenter.on("cells:range", _.bind(this.onCellsRange, this));
            }
            return this;
        },
        clickMenuFileItem: function (menu, action, isopts) {
            var close_menu = true;
            switch (action) {
            case "back":
                break;
            case "save":
                this.api.asc_Save();
                break;
            case "print":
                this.api.asc_Print();
                break;
            case "exit":
                Common.Gateway.goBack();
                break;
            case "edit":
                Common.Gateway.requestEditRights();
                break;
            case "new":
                if (isopts) {
                    close_menu = false;
                } else {
                    this.onCreateNew(undefined, "blank");
                }
                break;
            default:
                close_menu = false;
            }
            if (close_menu) {
                menu.hide();
                this.leftMenu.btnFile.toggle(false, true);
            }
        },
        clickSaveAsFormat: function (menu, format) {
            if (format == c_oAscFileType.CSV || format != c_oAscFileType.XLSX && this.api.asc_drawingObjectsExist()) {
                Common.UI.warning({
                    closable: false,
                    title: this.textWarning,
                    msg: this.warnDownloadAs,
                    buttons: ["ok", "cancel"],
                    callback: _.bind(function (btn) {
                        if (btn == "ok") {
                            this.api.asc_DownloadAs(format);
                            menu.hide();
                            this.leftMenu.btnFile.toggle(false, true);
                        }
                    },
                    this)
                });
            } else {
                this.api.asc_DownloadAs(format);
                menu.hide();
                this.leftMenu.btnFile.toggle(false, true);
            }
        },
        applySettings: function (menu) {
            this.api.asc_setFontRenderingMode(parseInt(window.localStorage.getItem("sse-settings-fontrender")));
            var value = window.localStorage.getItem("sse-settings-livecomment");
            (!(value !== null && parseInt(value) == 0)) ? this.api.asc_showComments() : this.api.asc_hideComments();
            if (this.mode.canAutosave) {
                value = window.localStorage.getItem("sse-settings-autosave");
                this.api.asc_setAutoSaveGap(parseInt(value));
            }
            menu.hide();
            this.leftMenu.btnFile.toggle(false, true);
        },
        onCreateNew: function (menu, type) {
            if (this.mode.nativeApp === true) {
                this.api.asc_openNewDocument(type == "blank" ? "" : type);
            } else {
                var newDocumentPage = window.open(_.template("<%= url %>?title=<%= title %>" + '<% if (doctype != "blank") { %>&template=<%= doctype %><% } %>' + "&action=create&doctype=spreadsheet", {
                    url: this.mode.createUrl,
                    title: this.newDocumentTitle,
                    doctype: type
                }));
                if (newDocumentPage) {
                    newDocumentPage.focus();
                }
            }
            if (menu) {
                menu.hide();
                this.leftMenu.btnFile.toggle(false, true);
            }
        },
        onOpenRecent: function (menu, url) {
            if (menu) {
                menu.hide();
                this.leftMenu.btnFile.toggle(false, true);
            }
            var recentDocPage = window.open(url);
            if (recentDocPage) {
                recentDocPage.focus();
            }
            Common.component.Analytics.trackEvent("Open Recent");
        },
        clickToolbarSettings: function (obj) {
            if (this.leftMenu.btnFile.pressed && this.leftMenu.btnFile.panel.active == "opts") {
                this.leftMenu.close();
            } else {
                this.leftMenu.showMenu("file:opts");
            }
        },
        clickStatusbarUsers: function () {
            if (this.mode.canCoAuthoring && this.mode.canChat) {
                if (this.leftMenu.btnChat.pressed) {
                    this.leftMenu.close();
                } else {
                    this.leftMenu.showMenu("chat");
                }
            }
        },
        onHideChat: function () {
            $(this.leftMenu.btnChat.el).blur();
            Common.NotificationCenter.trigger("layout:changed", "leftmenu");
        },
        onQuerySearch: function (d, w, opts) {
            if (opts.textsearch && opts.textsearch.length) {
                var options = this.dlgSearch.findOptions;
                options.asc_setFindWhat(opts.textsearch);
                options.asc_setScanForward(d != "back");
                options.asc_setIsMatchCase(opts.matchcase);
                options.asc_setIsWholeCell(opts.matchword);
                options.asc_setScanOnOnlySheet(this.dlgSearch.menuWithin.menu.items[0].checked);
                options.asc_setScanByRows(this.dlgSearch.menuSearch.menu.items[0].checked);
                options.asc_setLookIn(this.dlgSearch.menuLookin.menu.items[0].checked ? c_oAscFindLookIn.Formulas : c_oAscFindLookIn.Value);
                if (!this.api.asc_findText(options)) {
                    var me = this;
                    Common.UI.info({
                        msg: this.textNoTextFound,
                        callback: function () {
                            me.dlgSearch.focus();
                        }
                    });
                }
            }
        },
        onQueryReplace: function (w, opts) {
            if (!_.isEmpty(opts.textsearch) && !_.isEmpty(opts.textreplace)) {
                this.api.isReplaceAll = false;
                var options = this.dlgSearch.findOptions;
                options.asc_setFindWhat(opts.textsearch);
                options.asc_setReplaceWith(opts.textreplace);
                options.asc_setIsMatchCase(opts.matchcase);
                options.asc_setIsWholeCell(opts.matchword);
                options.asc_setScanOnOnlySheet(this.dlgSearch.menuWithin.menu.items[0].checked);
                options.asc_setScanByRows(this.dlgSearch.menuSearch.menu.items[0].checked);
                options.asc_setLookIn(this.dlgSearch.menuLookin.menu.items[0].checked ? c_oAscFindLookIn.Formulas : c_oAscFindLookIn.Value);
                options.asc_setIsReplaceAll(false);
                this.api.asc_replaceText(options);
            }
        },
        onQueryReplaceAll: function (w, opts) {
            if (!_.isEmpty(opts.textsearch) && !_.isEmpty(opts.textreplace)) {
                this.api.isReplaceAll = true;
                var options = this.dlgSearch.findOptions;
                options.asc_setFindWhat(opts.textsearch);
                options.asc_setReplaceWith(opts.textreplace);
                options.asc_setIsMatchCase(opts.matchcase);
                options.asc_setIsWholeCell(opts.matchword);
                options.asc_setScanOnOnlySheet(this.dlgSearch.menuWithin.menu.items[0].checked);
                options.asc_setScanByRows(this.dlgSearch.menuSearch.menu.items[0].checked);
                options.asc_setLookIn(this.dlgSearch.menuLookin.menu.items[0].checked ? c_oAscFindLookIn.Formulas : c_oAscFindLookIn.Value);
                options.asc_setIsReplaceAll(true);
                this.api.asc_replaceText(options);
            }
        },
        showSearchDlg: function (show, action) {
            if (!this.dlgSearch) {
                var menuWithin = new Common.UI.MenuItem({
                    caption: this.textWithin,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [{
                            caption: this.textSheet,
                            toggleGroup: "searchWithih",
                            checkable: true,
                            checked: true
                        },
                        {
                            caption: this.textWorkbook,
                            toggleGroup: "searchWithih",
                            checkable: true,
                            checked: false
                        }]
                    })
                });
                var menuSearch = new Common.UI.MenuItem({
                    caption: this.textSearch,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [{
                            caption: this.textByRows,
                            toggleGroup: "searchByrows",
                            checkable: true,
                            checked: true
                        },
                        {
                            caption: this.textByColumns,
                            toggleGroup: "searchByrows",
                            checkable: true,
                            checked: false
                        }]
                    })
                });
                var menuLookin = new Common.UI.MenuItem({
                    caption: this.textLookin,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [{
                            caption: this.textFormulas,
                            toggleGroup: "searchLookin",
                            checkable: true,
                            checked: true
                        },
                        {
                            caption: this.textValues,
                            toggleGroup: "searchLookin",
                            checkable: true,
                            checked: false
                        }]
                    })
                });
                this.dlgSearch = (new Common.UI.SearchDialog({
                    matchcase: true,
                    matchword: true,
                    matchwordstr: this.textItemEntireCell,
                    markresult: false,
                    extraoptions: [menuWithin, menuSearch, menuLookin]
                }));
                this.dlgSearch.menuWithin = menuWithin;
                this.dlgSearch.menuSearch = menuSearch;
                this.dlgSearch.menuLookin = menuLookin;
                this.dlgSearch.findOptions = new Asc.asc_CFindOptions();
            }
            if (show) {
                var mode = this.mode.isEdit ? (action || undefined) : "no-replace";
                if (this.dlgSearch.isVisible()) {
                    this.dlgSearch.setMode(mode);
                    this.dlgSearch.focus();
                } else {
                    this.dlgSearch.show(mode);
                }
                this.api.asc_closeCellEditor();
            } else {
                this.dlgSearch["hide"]();
            }
        },
        onMenuSearch: function (obj, show) {
            this.showSearchDlg(show);
        },
        onSearchDlgHide: function () {
            this.leftMenu.btnSearch.toggle(false, true);
            $(this.leftMenu.btnSearch.el).blur();
            this.api.asc_enableKeyEvents(true);
        },
        onRenameText: function (found, replaced) {
            var me = this;
            if (this.api.isReplaceAll) {
                Common.UI.info({
                    msg: (found) ? ((!found - replaced) ? Common.Utils.String.format(this.textReplaceSuccess, replaced) : Common.Utils.String.format(this.textReplaceSkipped, found - replaced)) : this.textNoTextFound,
                    callback: function () {
                        me.dlgSearch.focus();
                    }
                });
            } else {
                var sett = this.dlgSearch.getSettings();
                var options = this.dlgSearch.findOptions;
                options.asc_setFindWhat(sett.textsearch);
                options.asc_setScanForward(true);
                options.asc_setIsMatchCase(sett.matchcase);
                options.asc_setIsWholeCell(sett.matchword);
                options.asc_setScanOnOnlySheet(this.dlgSearch.menuWithin.menu.items[0].checked);
                options.asc_setScanByRows(this.dlgSearch.menuSearch.menu.items[0].checked);
                options.asc_setLookIn(this.dlgSearch.menuLookin.menu.items[0].checked ? c_oAscFindLookIn.Formulas : c_oAscFindLookIn.Value);
                if (!me.api.asc_findText(options)) {
                    Common.UI.info({
                        msg: this.textNoTextFound,
                        callback: function () {
                            me.dlgSearch.focus();
                        }
                    });
                }
            }
        },
        onApiServerDisconnect: function () {
            this.mode.isEdit = false;
            this.leftMenu.close();
            this.leftMenu.btnComments.setDisabled(true);
            this.leftMenu.btnChat.setDisabled(true);
            this.leftMenu.getMenu("file").setMode({
                isDisconnected: true
            });
            if (this.dlgSearch) {
                this.leftMenu.btnSearch.toggle(false, true);
                this.dlgSearch["hide"]();
            }
        },
        onApiChatMessage: function () {
            this.leftMenu.markCoauthOptions();
        },
        commentsShowHide: function (state) {
            if (this.api) {
                var value = window.localStorage.getItem("sse-settings-livecomment");
                if (value !== null && parseInt(value) == 0) {
                    (state) ? this.api.asc_showComments() : this.api.asc_hideComments();
                }
                if (state) {
                    this.getApplication().getController("Common.Controllers.Comments").focusOnInput();
                }
                this.api.asc_enableKeyEvents(!state);
                if (!state) {
                    $(this.leftMenu.btnComments.el).blur();
                }
            }
        },
        fileShowHide: function (state) {
            if (this.api) {
                this.api.asc_closeCellEditor();
                this.api.asc_enableKeyEvents(!state);
                if (!state) {
                    $(this.leftMenu.btnFile.el).blur();
                }
            }
        },
        aboutShowHide: function (state) {
            if (this.api) {
                this.api.asc_closeCellEditor();
                this.api.asc_enableKeyEvents(!state);
                if (!state) {
                    $(this.leftMenu.btnAbout.el).blur();
                }
            }
        },
        onShortcut: function (s, e) {
            if (this.mode.isEditDiagram && s != "escape") {
                return false;
            }
            switch (s) {
            case "replace":
                case "search":
                if (!this.leftMenu.btnSearch.isDisabled()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.showSearchDlg(true, s);
                    this.leftMenu.btnSearch.toggle(true, true);
                    this.leftMenu.btnFile.toggle(false);
                    this.leftMenu.btnAbout.toggle(false);
                }
                return false;
            case "save":
                if (this.mode.canDownload && !this.leftMenu.btnFile.isDisabled()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("file:saveas");
                }
                return false;
            case "help":
                if (!this.leftMenu.btnFile.isDisabled()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.api.asc_closeCellEditor();
                    this.leftMenu.showMenu("file:help");
                }
                return false;
            case "file":
                if (!this.leftMenu.btnFile.isDisabled()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("file");
                }
                return false;
            case "escape":
                var statusbar = SSE.getController("Statusbar");
                var menu_opened = statusbar.statusbar.$el.find('.open > [data-toggle="dropdown"]');
                if (menu_opened.length) {
                    $.fn.dropdown.Constructor.prototype.keydown.call(menu_opened[0], e);
                    return false;
                }
                if (this.leftMenu.btnFile.pressed || this.leftMenu.btnAbout.pressed || $(e.target).parents("#left-menu").length && this.api.isCellEdited !== true) {
                    this.leftMenu.close();
                    Common.NotificationCenter.trigger("layout:changed", "leftmenu");
                    return false;
                }
                if (this.mode.isEditDiagram) {
                    menu_opened = $(document.body).find(".open > .dropdown-menu");
                    if (!this.api.isCellEdited && !menu_opened.length) {
                        Common.Gateway.internalMessage("shortcut", {
                            key: "escape"
                        });
                        return false;
                    }
                }
                break;
            case "chat":
                if (this.mode.canCoAuthoring && this.mode.canChat) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("chat");
                }
                return false;
            case "comments":
                if (this.mode.canCoAuthoring && this.mode.isEdit && this.mode.canComments) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("comments");
                    this.getApplication().getController("Common.Controllers.Comments").focusOnInput();
                }
                return false;
            }
        },
        onCellsRange: function (status) {
            var isRangeSelection = (status != c_oAscSelectionDialogType.None);
            this.leftMenu.btnFile.setDisabled(isRangeSelection);
            this.leftMenu.btnAbout.setDisabled(isRangeSelection);
            this.leftMenu.btnSearch.setDisabled(isRangeSelection);
        },
        onApiEditCell: function (state) {
            var isEditFormula = (state == c_oAscCellEditorState.editFormula);
            this.leftMenu.btnFile.setDisabled(isEditFormula);
            this.leftMenu.btnAbout.setDisabled(isEditFormula);
            this.leftMenu.btnSearch.setDisabled(isEditFormula);
        },
        textNoTextFound: "Text not found",
        newDocumentTitle: "Unnamed document",
        textItemEntireCell: "Entire cell contents",
        requestEditRightsText: "Requesting editing rights...",
        textReplaceSuccess: "Search has been done. {0} occurrences have been replaced",
        textReplaceSkipped: "The replacement has been made. {0} occurrences were skipped.",
        warnDownloadAs: "If you continue saving in this format all features except the text will be lost.<br>Are you sure you want to continue?",
        textWarning : "Warning",
        textSheet: "Sheet",
        textWorkbook: "Workbook",
        textByColumns: "By columns",
        textByRows: "By rows",
        textFormulas: "Formulas",
        textValues: "Values",
        textWithin: "Within",
        textSearch: "Search",
        textLookin: "Look in"
    },
    SSE.Controllers.LeftMenu || {}));
});