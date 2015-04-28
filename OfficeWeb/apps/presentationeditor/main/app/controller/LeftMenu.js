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
 define(["core", "common/main/lib/util/Shortcuts", "presentationeditor/main/app/view/LeftMenu", "presentationeditor/main/app/view/FileMenu"], function () {
    PE.Controllers.LeftMenu = Backbone.Controller.extend(_.extend({
        views: ["LeftMenu", "FileMenu"],
        initialize: function () {
            this._state = {
                no_slides: undefined
            };
            this.addListeners({
                "Common.Views.Chat": {
                    "hide": _.bind(this.onHideChat, this)
                },
                "Statusbar": {
                    "click:users": _.bind(this.clickStatusbarUsers, this)
                },
                "LeftMenu": {
                    "panel:show": _.bind(this.menuExpand, this),
                    "comments:show": _.bind(this.commentsShowHide, this, "show"),
                    "comments:hide": _.bind(this.commentsShowHide, this, "hide")
                },
                "Common.Views.About": {
                    "show": _.bind(this.aboutShowHide, this, false),
                    "hide": _.bind(this.aboutShowHide, this, true)
                },
                "FileMenu": {
                    "filemenu:hide": _.bind(this.menuFilesHide, this),
                    "item:click": _.bind(this.clickMenuFileItem, this),
                    "saveas:format": _.bind(this.clickSaveAsFormat, this),
                    "settings:apply": _.bind(this.applySettings, this),
                    "create:new": _.bind(this.onCreateNew, this),
                    "recent:open": _.bind(this.onOpenRecent, this)
                },
                "Toolbar": {
                    "file:saving": _.bind(this.onToolbarSaving, this),
                    "file:settings": _.bind(this.clickToolbarSettings, this)
                },
                "SearchDialog": {
                    "hide": _.bind(this.onSearchDlgHide, this),
                    "search:back": _.bind(this.onQuerySearch, this, "back"),
                    "search:next": _.bind(this.onQuerySearch, this, "next")
                }
            });
        },
        onLaunch: function () {
            this.leftMenu = this.createView("LeftMenu").render();
            this.leftMenu.btnSearch.on("toggle", _.bind(this.onMenuSearch, this));
            this.leftMenu.btnThumbs.on("toggle", _.bind(this.onShowTumbnails, this));
            this.isThumbsShown = true;
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: {
                    "command+shift+s,ctrl+shift+s": _.bind(this.onShortcut, this, "save"),
                    "command+f,ctrl+f": _.bind(this.onShortcut, this, "search"),
                    "alt+f": _.bind(this.onShortcut, this, "file"),
                    "esc": _.bind(this.onShortcut, this, "escape"),
                    "ctrl+alt+q": _.bind(this.onShortcut, this, "chat"),
                    "command+shift+h,ctrl+shift+h": _.bind(this.onShortcut, this, "comments"),
                    "f1": _.bind(this.onShortcut, this, "help")
                }
            });
            Common.util.Shortcuts.suspendEvents();
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onThumbnailsShow", _.bind(this.onThumbnailsShow, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiServerDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiServerDisconnect, this));
            if (this.mode.canCoAuthoring) {
                this.api.asc_registerCallback("asc_onCoAuthoringChatReceiveMessage", _.bind(this.onApiChatMessage, this));
            }
            this.api.asc_registerCallback("asc_onCountPages", _.bind(this.onApiCountPages, this));
            this.onApiCountPages(this.api.getCountPages());
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
                this.leftMenu.btnComments[this.mode.isEdit ? "show" : "hide"]();
                this.leftMenu.btnChat.show();
                this.leftMenu.setOptionsPanel("chat", this.getApplication().getController("Common.Controllers.Chat").getView("Common.Views.Chat"));
                this.leftMenu.setOptionsPanel("comment", this.getApplication().getController("Common.Controllers.Comments").getView("Common.Views.Comments"));
            } else {
                this.leftMenu.btnChat.hide();
                this.leftMenu.btnComments.hide();
            }
            Common.util.Shortcuts.resumeEvents();
            this.leftMenu.btnThumbs.toggle(true);
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
                this.getApplication().getController("Statusbar").setStatusCaption(this.requestEditRightsText);
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
            this.api.asc_DownloadAs(format);
            menu.hide();
            this.leftMenu.btnFile.toggle(false, true);
        },
        applySettings: function (menu) {
            var value = window.localStorage.getItem("pe-settings-inputmode");
            this.api.SetTextBoxInputMode(parseInt(value) == 1);
            value = window.localStorage.getItem("pe-settings-showchanges");
            this.api.SetCollaborativeMarksShowType(value != "last" ? c_oAscCollaborativeMarksShowType.All : c_oAscCollaborativeMarksShowType.LastChanges);
            if (this.mode.canAutosave) {
                value = window.localStorage.getItem("pe-settings-autosave");
                this.api.asc_setAutoSaveGap(parseInt(value));
            }
            value = window.localStorage.getItem("pe-settings-showsnaplines");
            this.api.put_ShowSnapLines(value === null || parseInt(value) == 1);
            menu.hide();
            this.leftMenu.btnFile.toggle(false, true);
        },
        onCreateNew: function (menu, type) {
            if (this.mode.nativeApp === true) {
                this.api.OpenNewDocument(type == "blank" ? "" : type);
            } else {
                var newDocumentPage = window.open(_.template("<%= url %>?title=<%= title %>" + '<% if (doctype != "blank") { %>&template=<%= doctype %><% } %>' + "&action=create&doctype=presentation", {
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
        onToolbarSaving: function (obj, status) {
            this.leftMenu.getMenu("file").disableMenu("save", status);
        },
        clickStatusbarUsers: function () {
            if (this.mode.canCoAuthoring) {
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
                if (!this.api.findText(opts.textsearch, d != "back")) {
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
        showSearchDlg: function (show) {
            if (!this.dlgSearch) {
                this.dlgSearch = (new Common.UI.SearchDialog({}));
            }
            if (show) {
                this.dlgSearch.isVisible() ? this.dlgSearch.focus() : this.dlgSearch.show("no-replace");
            } else {
                this.dlgSearch["hide"]();
            }
        },
        onMenuSearch: function (obj, show) {
            this.showSearchDlg(show);
        },
        onShowTumbnails: function (obj, show) {
            this.api.ShowThumbnails(show);
        },
        onThumbnailsShow: function (isShow) {
            if (isShow && !this.isThumbsShown) {
                this.leftMenu.btnThumbs.toggle(true, false);
            } else {
                if (!isShow && this.isThumbsShown) {
                    this.leftMenu.btnThumbs.toggle(false, false);
                }
            }
            this.isThumbsShown = isShow;
        },
        onSearchDlgHide: function () {
            this.leftMenu.btnSearch.toggle(false, true);
            $(this.leftMenu.btnSearch.el).blur();
            this.api.asc_enableKeyEvents(true);
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
        onApiCountPages: function (count) {
            if (this._state.no_slides !== (count <= 0) && this.mode.isEdit) {
                this._state.no_slides = (count <= 0);
                this.leftMenu.btnComments.setDisabled(this._state.no_slides);
                this.leftMenu.btnSearch.setDisabled(this._state.no_slides);
            }
        },
        menuExpand: function (obj, panel, show) {
            if (panel == "thumbs") {
                this.isThumbsShown = show;
            } else {
                if (!show && this.isThumbsShown) {
                    this.leftMenu.btnThumbs.toggle(true, false);
                }
            }
        },
        menuFilesHide: function (obj) {
            $(this.leftMenu.btnFile.el).blur();
        },
        onApiChatMessage: function () {
            this.leftMenu.markCoauthOptions();
        },
        commentsShowHide: function (mode) {
            if (mode === "show") {
                this.getApplication().getController("Common.Controllers.Comments").focusOnInput();
            } else {
                $(this.leftMenu.btnComments.el).blur();
            }
        },
        aboutShowHide: function (value) {
            if (this.api) {
                this.api.asc_enableKeyEvents(value);
            }
            if (value) {
                $(this.leftMenu.btnAbout.el).blur();
            }
        },
        onShortcut: function (s, e) {
            var previewPanel = PE.getController("Viewport").getView("DocumentPreview");
            switch (s) {
            case "search":
                if ((!previewPanel || !previewPanel.isVisible()) && !this._state.no_slides) {
                    Common.UI.Menu.Manager.hideAll();
                    var full_menu_pressed = (this.leftMenu.btnFile.pressed || this.leftMenu.btnAbout.pressed);
                    this.showSearchDlg(true);
                    this.leftMenu.btnSearch.toggle(true, true);
                    this.leftMenu.btnFile.toggle(false);
                    this.leftMenu.btnAbout.toggle(false);
                    full_menu_pressed && this.menuExpand(this.leftMenu.btnFile, "files", false);
                }
                return false;
            case "save":
                if (this.mode.canDownload && (!previewPanel || !previewPanel.isVisible())) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("file:saveas");
                }
                return false;
            case "help":
                if (!previewPanel || !previewPanel.isVisible()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("file:help");
                }
                return false;
            case "file":
                if (!previewPanel || !previewPanel.isVisible()) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("file");
                }
                return false;
            case "escape":
                var statusbar = PE.getController("Statusbar");
                var menu_opened = statusbar.statusbar.$el.find('.open > [data-toggle="dropdown"]');
                if (menu_opened.length) {
                    $.fn.dropdown.Constructor.prototype.keydown.call(menu_opened[0], e);
                    return false;
                }
                if (this.leftMenu.btnFile.pressed || this.leftMenu.btnAbout.pressed || $(e.target).parents("#left-menu").length) {
                    this.leftMenu.close();
                    Common.NotificationCenter.trigger("layout:changed", "leftmenu");
                    return false;
                }
                break;
            case "chat":
                if (this.mode.canCoAuthoring && (!previewPanel || !previewPanel.isVisible())) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("chat");
                }
                return false;
            case "comments":
                if (this.mode.canCoAuthoring && this.mode.isEdit && (!previewPanel || !previewPanel.isVisible()) && !this._state.no_slides) {
                    Common.UI.Menu.Manager.hideAll();
                    this.leftMenu.showMenu("comments");
                    this.getApplication().getController("Common.Controllers.Comments").focusOnInput();
                }
                return false;
            }
        },
        textNoTextFound: "Text not found",
        newDocumentTitle: "Unnamed document",
        requestEditRightsText: "Requesting editing rights..."
    },
    PE.Controllers.LeftMenu || {}));
});