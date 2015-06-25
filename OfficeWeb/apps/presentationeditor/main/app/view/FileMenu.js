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
 define(["text!presentationeditor/main/app/template/FileMenu.template", "underscore", "common/main/lib/component/BaseView"], function (tpl, _) {
    PE.Views.FileMenu = Common.UI.BaseView.extend(_.extend({
        el: "#file-menu-panel",
        template: _.template(tpl),
        events: function () {
            return {
                "click .fm-btn": _.bind(function (event) {
                    var $item = $(event.currentTarget);
                    if ($item.hasClass("disabled")) {
                        return;
                    } else {
                        if (!$item.hasClass("active")) {
                            $(".fm-btn", this.el).removeClass("active");
                            $item.addClass("active");
                        }
                    }
                    var item = _.findWhere(this.items, {
                        el: event.currentTarget
                    });
                    if (item) {
                        var panel = this.panels[item.options.action];
                        this.fireEvent("item:click", [this, item.options.action, !!panel]);
                        if (panel) {
                            this.$el.find(".content-box:visible").hide();
                            this.active = item.options.action;
                            panel.show();
                        }
                    }
                },
                this)
            };
        },
        initialize: function () {},
        render: function () {
            this.$el = $(this.el);
            this.$el.html(this.template());
            this.items = [];
            this.items.push(new Common.UI.MenuItem({
                el: $("#fm-btn-return", this.el),
                action: "back",
                caption: this.btnReturnCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-save", this.el),
                action: "save",
                caption: this.btnSaveCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-edit", this.el),
                action: "edit",
                caption: this.btnToEditCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-download", this.el),
                action: "saveas",
                caption: this.btnDownloadCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-print", this.el),
                action: "print",
                caption: this.btnPrintCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-recent", this.el),
                action: "recent",
                caption: this.btnRecentFilesCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-create", this.el),
                action: "new",
                caption: this.btnCreateNewCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-info", this.el),
                action: "info",
                caption: this.btnInfoCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-rights", this.el),
                action: "rights",
                caption: this.btnRightsCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-settings", this.el),
                action: "opts",
                caption: this.btnSettingsCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-help", this.el),
                action: "help",
                caption: this.btnHelpCaption,
                canFocused: false
            }), new Common.UI.MenuItem({
                el: $("#fm-btn-back", this.el),
                action: "exit",
                caption: this.btnBackCaption,
                canFocused: false
            }));
            var me = this;
            this.panels = {};
            require(["presentationeditor/main/app/view/FileMenuPanels"], function () {
                me.panels = {
                    "saveas": (new PE.Views.FileMenuPanels.ViewSaveAs({
                        menu: me
                    })).render(),
                    "opts": (new PE.Views.FileMenuPanels.Settings({
                        menu: me
                    })).render(),
                    "info": (new PE.Views.FileMenuPanels.DocumentInfo({
                        menu: me
                    })).render(),
                    "rights": (new PE.Views.FileMenuPanels.DocumentRights({
                        menu: me
                    })).render(),
                    "help": (new PE.Views.FileMenuPanels.Help({
                        menu: me
                    })).render()
                };
                me.$el.find(".content-box").hide();
            });
            return this;
        },
        show: function (panel) {
            if (this.isVisible() && panel === undefined) {
                return;
            }
            if (!panel) {
                panel = this.active || (this.mode.canDownload ? "saveas" : "info");
            }
            this.$el.show();
            this.selectMenu(panel);
            if (this.mode.isEdit) {
                PE.getController("Toolbar").DisableToolbar(true);
            }
            this.api.asc_enableKeyEvents(false);
        },
        hide: function () {
            this.$el.hide();
            if (this.mode.isEdit) {
                PE.getController("Toolbar").DisableToolbar(false);
            }
            this.fireEvent("filemenu:hide", [this]);
            this.api.asc_enableKeyEvents(true);
        },
        applyMode: function () {
            this.items[5][this.mode.canOpenRecent ? "show" : "hide"]();
            this.items[6][this.mode.canCreateNew ? "show" : "hide"]();
            this.items[6].$el.find("+.devider")[this.mode.canCreateNew ? "show" : "hide"]();
            this.items[3][this.mode.canDownload ? "show" : "hide"]();
            this.items[1][this.mode.isEdit ? "show" : "hide"]();
            this.items[2][!this.mode.isEdit && this.mode.canEdit ? "show" : "hide"]();
            this.mode.canBack ? this.$el.find("#fm-btn-back").show().prev().show() : this.$el.find("#fm-btn-back").hide().prev().hide();
            this.items[8][(this.document && this.document.info && (this.document.info.sharingSettings && this.document.info.sharingSettings.length > 0 || this.mode.sharingSettingsUrl && this.mode.sharingSettingsUrl.length)) ? "show" : "hide"]();
            this.panels["opts"].setMode(this.mode);
            this.panels["info"].setMode(this.mode).updateInfo(this.document);
            this.panels["rights"].setMode(this.mode).updateInfo(this.document);
            if (this.mode.canCreateNew) {
                if (this.mode.templates && this.mode.templates.length) {
                    $("a", this.items[6].$el).text(this.btnCreateNewCaption + "...");
                    this.panels["new"] = ((new PE.Views.FileMenuPanels.CreateNew({
                        menu: this,
                        docs: this.mode.templates
                    })).render());
                }
            }
            if (this.mode.canOpenRecent) {
                if (this.mode.recent) {
                    this.panels["recent"] = (new PE.Views.FileMenuPanels.RecentFiles({
                        menu: this,
                        recent: this.mode.recent
                    })).render();
                }
            }
            if (this.mode.targetApp == "desktop") {
                this.$el.find("#fm-btn-create, #fm-btn-back, #fm-btn-create+.devider").hide();
            }
            this.panels["help"].setLangConfig(this.mode.lang);
        },
        setMode: function (mode, delay) {
            if (mode.isDisconnected) {
                this.mode.canEdit = this.mode.isEdit = false;
                this.mode.canOpenRecent = this.mode.canCreateNew = false;
            } else {
                this.mode = mode;
            }
            if (!delay) {
                this.applyMode();
            }
        },
        setApi: function (api) {
            this.api = api;
        },
        loadDocument: function (data) {
            this.document = data.doc;
        },
        selectMenu: function (menu) {
            if (menu) {
                var item = this._getMenuItem(menu),
                panel = this.panels[menu];
                if (item && panel) {
                    $(".fm-btn", this.el).removeClass("active");
                    item.$el.addClass("active");
                    this.$el.find(".content-box:visible").hide();
                    panel.show();
                    this.active = menu;
                }
            }
        },
        disableMenu: function (menu, status) {
            if (menu) {
                var item = this._getMenuItem(menu);
                if (item) {
                    item.setDisabled(status);
                }
            }
        },
        _getMenuItem: function (action) {
            return _.find(this.items, function (item) {
                return item.options.action == action;
            });
        },
        btnSaveCaption: "Save",
        btnDownloadCaption: "Download as...",
        btnInfoCaption: "Document Info...",
        btnRightsCaption: "Access Rights...",
        btnCreateNewCaption: "Create New",
        btnRecentFilesCaption: "Open Recent...",
        btnPrintCaption: "Print",
        btnHelpCaption: "Help...",
        btnReturnCaption: "Back to Document",
        btnToEditCaption: "Edit Document",
        btnBackCaption: "Go to Documents",
        btnSettingsCaption: "Advanced Settings..."
    },
    PE.Views.FileMenu || {}));
});