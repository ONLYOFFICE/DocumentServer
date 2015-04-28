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
 define(["text!documenteditor/main/app/template/LeftMenu.template", "jquery", "underscore", "backbone", "common/main/lib/component/Button", "common/main/lib/view/About", "common/main/lib/view/Comments", "common/main/lib/view/Chat", "common/main/lib/view/About", "common/main/lib/view/SearchDialog", "documenteditor/main/app/view/FileMenu"], function (menuTemplate, $, _, Backbone) {
    var SCALE_MIN = 40;
    var MENU_SCALE_PART = 300;
    DE.Views.LeftMenu = Backbone.View.extend(_.extend({
        el: "#left-menu",
        template: _.template(menuTemplate),
        events: function () {
            return {
                "click #left-btn-support": function () {
                    window.open("http://feedback.onlyoffice.com/");
                },
                "click #left-btn-comments": _.bind(this.onCoauthOptions, this),
                "click #left-btn-chat": _.bind(this.onCoauthOptions, this)
            };
        },
        initialize: function () {
            this.minimizedMode = true;
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template({}));
            this.btnFile = new Common.UI.Button({
                action: "file",
                el: $("#left-btn-file"),
                hint: this.tipFile + Common.Utils.String.platformKey("Alt+F"),
                enableToggle: true,
                disabled: true,
                toggleGroup: "leftMenuGroup"
            });
            this.btnSearch = new Common.UI.Button({
                action: "search",
                el: $("#left-btn-search"),
                hint: this.tipSearch + Common.Utils.String.platformKey("Ctrl+F"),
                disabled: true,
                enableToggle: true
            });
            this.btnAbout = new Common.UI.Button({
                action: "about",
                el: $("#left-btn-about"),
                hint: this.tipAbout,
                enableToggle: true,
                disabled: true,
                toggleGroup: "leftMenuGroup"
            });
            this.btnSupport = new Common.UI.Button({
                action: "support",
                el: $("#left-btn-support"),
                hint: this.tipSupport,
                disabled: true
            });
            this.btnComments = new Common.UI.Button({
                el: $("#left-btn-comments"),
                hint: this.tipComments + Common.Utils.String.platformKey("Ctrl+Shift+H"),
                enableToggle: true,
                disabled: true,
                toggleGroup: "leftMenuGroup"
            });
            this.btnChat = new Common.UI.Button({
                el: $("#left-btn-chat"),
                hint: this.tipChat + Common.Utils.String.platformKey("Ctrl+Alt+Q", null, function (string) {
                    if (Common.Utils.isMac) {
                        string = string.replace(/Ctrl|ctrl/g, "⌃");
                    }
                    return string;
                }),
                enableToggle: true,
                disabled: true,
                toggleGroup: "leftMenuGroup"
            });
            this.btnComments.hide();
            this.btnChat.hide();
            this.btnComments.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnChat.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnSearch.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnAbout.on("toggle", _.bind(this.onBtnMenuToggle, this));
            this.btnFile.on("toggle", _.bind(this.onBtnMenuToggle, this));
            var menuFile = new DE.Views.FileMenu({});
            menuFile.options = {
                alias: "FileMenu"
            };
            this.btnFile.panel = menuFile.render();
            this.btnAbout.panel = (new Common.Views.About({
                el: $("#about-menu-panel"),
                appName: "Document Editor"
            })).render();
            return this;
        },
        onBtnMenuToggle: function (btn, state) {
            if (state) {
                btn.panel["show"]();
                this.$el.width(SCALE_MIN);
                if (this.btnSearch.isActive()) {
                    this.btnSearch.toggle(false);
                }
            } else {
                btn.panel["hide"]();
            }
            if (this.mode.isEdit) {
                DE.getController("Toolbar").DisableToolbar(state == true);
            }
            if (!this.supressEvents) {
                Common.NotificationCenter.trigger("layout:changed", "leftmenu");
            }
        },
        onBtnMenuClick: function (btn, e) {
            this.supressEvents = true;
            this.btnFile.toggle(false);
            this.btnAbout.toggle(false);
            if (btn.options.action == "search") {} else {
                if (btn.pressed) {
                    if (! (this.$el.width() > SCALE_MIN)) {
                        this.$el.width(localStorage.getItem("de-mainmenu-width") || MENU_SCALE_PART);
                    }
                } else {
                    localStorage.setItem("de-mainmenu-width", this.$el.width());
                    this.$el.width(SCALE_MIN);
                }
            }
            this.supressEvents = false;
            Common.NotificationCenter.trigger("layout:changed", "leftmenu");
        },
        onCoauthOptions: function (e) {
            if (this.mode.canCoAuthoring) {
                this.panelComments[this.btnComments.pressed ? "show" : "hide"]();
                this.fireEvent((this.btnComments.pressed) ? "comments:show": "comments:hide", this);
                if (this.btnChat.pressed) {
                    if (this.btnChat.$el.hasClass("notify")) {
                        this.btnChat.$el.removeClass("notify");
                    }
                    this.panelChat.show();
                    this.panelChat.focus();
                } else {
                    this.panelChat["hide"]();
                }
            }
        },
        setOptionsPanel: function (name, panel) {
            if (name == "chat") {
                this.panelChat = panel.render("#left-panel-chat");
            } else {
                if (name == "comment") {
                    this.panelComments = panel;
                }
            }
        },
        markCoauthOptions: function (opt) {
            if (this.btnChat.isVisible() && !this.btnChat.isDisabled() && !this.btnChat.pressed) {
                this.btnChat.$el.addClass("notify");
            }
        },
        close: function (menu) {
            this.btnFile.toggle(false);
            this.btnAbout.toggle(false);
            this.$el.width(SCALE_MIN);
            if (this.mode.canCoAuthoring) {
                this.panelComments["hide"]();
                this.panelChat["hide"]();
                if (this.btnComments.pressed) {
                    this.fireEvent("comments:hide", this);
                }
                this.btnComments.toggle(false, true);
                this.btnChat.toggle(false, true);
            }
        },
        isOpened: function () {
            var isopened = this.btnFile.pressed || this.btnSearch.pressed; ! isopened && (isopened = this.btnComments.pressed || this.btnChat.pressed);
            return isopened;
        },
        disableMenu: function (menu, disable) {
            this.btnFile.setDisabled(false);
            this.btnSearch.setDisabled(false);
            this.btnAbout.setDisabled(false);
            this.btnSupport.setDisabled(false);
            this.btnComments.setDisabled(false);
            this.btnChat.setDisabled(false);
        },
        showMenu: function (menu) {
            var re = /^(\w+):?(\w*)$/.exec(menu);
            if (re[1] == "file") {
                if (!this.btnFile.pressed) {
                    this.btnFile.toggle(true);
                }
                this.btnFile.panel.show(re[2].length ? re[2] : undefined);
            } else {
                if (menu == "chat") {
                    if (this.btnChat.isVisible() && !this.btnChat.isDisabled() && !this.btnChat.pressed) {
                        this.btnChat.toggle(true);
                        this.onBtnMenuClick(this.btnChat);
                        this.onCoauthOptions();
                        this.panelChat.focus();
                    }
                } else {
                    if (menu == "comments") {
                        if (this.btnComments.isVisible() && !this.btnComments.isDisabled() && !this.btnComments.pressed) {
                            this.btnComments.toggle(true);
                            this.onBtnMenuClick(this.btnComments);
                            this.onCoauthOptions();
                        }
                    }
                }
            }
        },
        getMenu: function (type) {
            switch (type) {
            default:
                return null;
            case "file":
                return this.btnFile.panel;
            case "about":
                return this.btnAbout.panel;
            }
        },
        setMode: function (mode) {
            this.mode = mode;
            return this;
        },
        tipComments: "Comments",
        tipChat: "Chat",
        tipAbout: "About",
        tipSupport: "Feedback & Support",
        tipFile: "File",
        tipSearch: "Search"
    },
    DE.Views.LeftMenu || {}));
});